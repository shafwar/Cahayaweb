<?php

namespace App\Http\Controllers\B2B;

use App\Http\Controllers\Controller;
use App\Models\B2BBooking;
use App\Models\Package;
use App\Services\InvoiceService;
use App\Services\WhatsAppService;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function __construct(
        private InvoiceService $invoiceService,
        private WhatsAppService $whatsAppService,
        private EmailService $emailService
    ) {}

    /**
     * Show the booking creation form
     */
    public function create(Request $request, Package $package)
    {
        $user = Auth::user();

        // Ensure package is active and has B2B pricing
        if (!$package->is_active || !$package->b2b_price) {
            abort(404, 'Package not available for B2B booking');
        }

        // Package data is already loaded

        return Inertia::render('b2b/booking/create', [
            'user' => $user->load(['userType', 'b2bVerification']),
            'package' => $package,
        ]);
    }

    /**
     * Create a new B2B booking
     */
    public function store(Request $request)
    {
        // Debug logging
        \Log::info('B2B Booking Store Request:', $request->all());

        // Test if we can reach this point
        \Log::info('B2B Booking Store: Starting validation...');

        $validator = Validator::make($request->all(), [
            'package_id' => 'required|exists:packages,id',
            'travelers_count' => 'required|integer|min:1|max:50',
            'traveler_details' => 'required|array|min:1',
            'traveler_details.*.name' => 'required|string|max:255',
            'traveler_details.*.passport_number' => 'nullable|string|max:50',
            'traveler_details.*.date_of_birth' => 'nullable|date',
            'traveler_details.*.phone' => 'required|string|max:20',
            'traveler_details.*.email' => 'required|email|max:255',
            'special_requests' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            \Log::error('B2B Booking Validation Failed:', $validator->errors()->toArray());
            return back()->withErrors($validator->errors())->withInput();
        }

        \Log::info('B2B Booking Store: Validation passed, starting transaction...');

        try {
            DB::beginTransaction();
            \Log::info('B2B Booking Store: Transaction started...');

            $package = Package::findOrFail($request->package_id);
            \Log::info('B2B Booking Store: Package found...');

            $partner = Auth::user();
            \Log::info('B2B Booking Store: Partner authenticated...');

            // Calculate pricing
            \Log::info('B2B Booking Store: Calculating pricing...');
            $basePrice = $package->getPriceForUser($partner);
            $totalAmount = $basePrice * $request->travelers_count;
            $b2bDiscount = $package->getB2BSavings() * $request->travelers_count;
            $finalAmount = $totalAmount - $b2bDiscount;
            \Log::info('B2B Booking Store: Pricing calculated...');

            // Create booking with initial status history
            \Log::info('B2B Booking Store: Creating booking record...');
            $booking = B2BBooking::create([
                'partner_id' => $partner->id,
                'package_id' => $package->id,
                'travelers_count' => $request->travelers_count,
                'total_amount' => $totalAmount,
                'b2b_discount' => $b2bDiscount,
                'final_amount' => $finalAmount,
                'traveler_details' => $request->traveler_details,
                'special_requests' => $request->special_requests,
                'status' => 'pending',
                'status_history' => [[
                    'from_status' => null,
                    'to_status' => 'pending',
                    'admin_id' => null,
                    'notes' => 'Booking created',
                    'timestamp' => now()->toISOString(),
                ]],
            ]);
            \Log::info('B2B Booking Store: Booking record created...');

            // Generate invoice
            \Log::info('B2B Booking Store: Generating invoice...');
            $invoiceData = $this->invoiceService->generateInvoice($booking);
            $booking->update([
                'invoice_url' => $invoiceData['url'],
                'invoice_pdf_path' => $invoiceData['pdf_path'],
            ]);
            \Log::info('B2B Booking Store: Invoice generated and updated...');

            // Send notifications (Email primary, WhatsApp secondary)
            \Log::info('B2B Booking Store: Sending email notification...');
            $emailResult = $this->emailService->sendInvoice($booking);
            \Log::info('B2B Booking Store: Email sent...');

            \Log::info('B2B Booking Store: Sending WhatsApp notification...');
            $whatsappResult = $this->whatsAppService->sendInvoice($booking);
            \Log::info('B2B Booking Store: WhatsApp sent...');

            DB::commit();

            \Log::info('B2B Booking Created Successfully:', [
                'booking_id' => $booking->id,
                'partner_id' => $booking->partner_id,
                'package_id' => $booking->package_id,
                'total_amount' => $booking->total_amount
            ]);

            return redirect()->route('b2b.bookings.show', $booking)
                ->with('success', 'Booking created successfully! Invoice has been sent to your email.');

        } catch (\Exception $e) {
            DB::rollBack();

            \Log::error('B2B Booking Creation Failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->withErrors(['error' => 'Failed to create booking: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Get partner's bookings
     */
    public function index(Request $request)
    {
        $partner = Auth::user();

        $bookings = B2BBooking::where('partner_id', $partner->id)
            ->with(['package', 'processedBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('b2b/bookings/index', [
            'user' => $partner->load(['userType', 'b2bVerification']),
            'bookings' => $bookings,
        ]);
    }

    /**
     * Get specific booking details
     */
    public function show(B2BBooking $booking)
    {
        // Ensure partner can only view their own bookings
        if ($booking->partner_id !== Auth::id()) {
            abort(403, 'Unauthorized access');
        }

        $booking->load(['package', 'partner', 'processedBy']);

        return Inertia::render('b2b/bookings/show', [
            'user' => Auth::user()->load(['userType', 'b2bVerification']),
            'booking' => $booking,
        ]);
    }

    /**
     * Upload payment proof
     */
    public function uploadPaymentProof(Request $request, B2BBooking $booking)
    {
        // Ensure partner can only upload proof for their own bookings
        if ($booking->partner_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Store payment proof
            $file = $request->file('payment_proof');
            $filename = 'payment-proofs/' . $booking->booking_reference . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('public', $filename);

            // Update booking
            $booking->uploadPaymentProof($filename);

            // Notify admin via WhatsApp
            $this->whatsAppService->notifyAdminPaymentReceived($booking);

            return response()->json([
                'success' => true,
                'message' => 'Payment proof uploaded successfully',
                'data' => [
                    'payment_proof' => $filename,
                    'status' => $booking->status,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload payment proof',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel booking
     */
    public function cancel(Request $request, B2BBooking $booking)
    {
        // Ensure partner can only cancel their own bookings
        if ($booking->partner_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        // Only allow cancellation if pending
        if ($booking->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel booking in current status'
            ], 400);
        }

        try {
            $booking->updateStatus('rejected', null, $request->reason ?? 'Cancelled by partner');

            // Notify admin
            $this->whatsAppService->notifyAdminBookingCancelled($booking);

            return response()->json([
                'success' => true,
                'message' => 'Booking cancelled successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
