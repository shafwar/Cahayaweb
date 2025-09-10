<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\B2BBooking;
use App\Services\EmailService;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class B2BBookingController extends Controller
{
    public function __construct(
        private WhatsAppService $whatsAppService,
        private EmailService $emailService
    ) {}

    /**
     * Get all B2B bookings with filters
     */
    public function index(Request $request)
    {
        $query = B2BBooking::with(['partner', 'package', 'processedBy']);

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('partner_id')) {
            $query->where('partner_id', $request->partner_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_reference', 'like', "%{$search}%")
                  ->orWhere('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('partner', function ($partnerQuery) use ($search) {
                      $partnerQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('package', function ($packageQuery) use ($search) {
                      $packageQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate(20);

        // Get stats for dashboard
        $stats = [
            'total_bookings' => B2BBooking::count(),
            'pending_bookings' => B2BBooking::where('status', 'pending')->count(),
            'confirmed_bookings' => B2BBooking::where('status', 'confirmed')->count(),
            'rejected_bookings' => B2BBooking::where('status', 'rejected')->count(),
            'total_revenue' => B2BBooking::where('status', 'confirmed')->sum('final_amount'),
        ];

        return inertia('admin/b2b-bookings/index', [
            'bookings' => $bookings,
            'stats' => $stats,
            'filters' => $request->only(['status', 'partner_id', 'date_from', 'date_to', 'search'])
        ]);
    }

    /**
     * Get specific booking details
     */
    public function show(B2BBooking $booking)
    {
        $booking->load(['partner.b2bVerification', 'package', 'processedBy']);

        return inertia('admin/b2b-bookings/show', [
            'booking' => $booking
        ]);
    }

    /**
     * Update booking status
     */
    public function updateStatus(Request $request, B2BBooking $booking)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:confirmed,rejected',
            'notes' => 'nullable|string|max:1000',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $adminId = auth()->id();

            // Update status with history tracking
            $notes = $request->admin_notes ?? $request->notes;
            if ($request->status === 'confirmed') {
                $booking->markConfirmed($adminId, $notes);
                // Send confirmation notifications
                $this->sendConfirmation($booking);
            } else {
                $booking->markRejected($adminId, $notes);
                // Send rejection notifications
                $this->sendRejection($booking);
            }

            return back()->with('success', 'Booking status updated successfully');

        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update booking status: ' . $e->getMessage());
        }
    }

    /**
     * Send payment details to partner
     */
    public function sendPaymentDetails(B2BBooking $booking)
    {
        try {
            $result = $this->whatsAppService->sendPaymentDetails($booking);

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message']
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send payment details: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send booking confirmation
     */
    public function sendConfirmation(B2BBooking $booking)
    {
        try {
            // Send via Email (primary)
            $emailResult = $this->emailService->sendBookingConfirmation($booking);

            // Send via WhatsApp (secondary)
            $whatsappResult = $this->whatsAppService->sendConfirmation($booking);

            return [
                'success' => true,
                'message' => 'Confirmation sent successfully',
                'email_sent' => $emailResult['success'],
                'whatsapp_sent' => $whatsappResult['success']
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to send confirmation: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send booking rejection
     */
    public function sendRejection(B2BBooking $booking)
    {
        try {
            // Send via Email (primary)
            $emailResult = $this->emailService->sendBookingCancellation($booking, 'Booking rejected by admin');

            // Send via WhatsApp (secondary)
            $whatsappResult = $this->whatsAppService->sendRejection($booking);

            return [
                'success' => true,
                'message' => 'Rejection notice sent successfully',
                'email_sent' => $emailResult['success'],
                'whatsapp_sent' => $whatsappResult['success']
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to send rejection notice: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get booking statistics
     */
    public function getStats()
    {
        $stats = [
            'total_bookings' => B2BBooking::count(),
            'pending_bookings' => B2BBooking::where('status', 'pending')->count(),
            'confirmed_bookings' => B2BBooking::where('status', 'confirmed')->count(),
            'rejected_bookings' => B2BBooking::where('status', 'rejected')->count(),
            'total_revenue' => B2BBooking::where('status', 'confirmed')->sum('final_amount'),
            'pending_revenue' => B2BBooking::where('status', 'pending')->sum('final_amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * Get recent bookings
     */
    public function getRecentBookings()
    {
        $bookings = B2BBooking::with(['partner', 'package'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Download payment proof
     */
    public function downloadPaymentProof(B2BBooking $booking)
    {
        if (!$booking->payment_proof_path) {
            return response()->json([
                'success' => false,
                'message' => 'Payment proof not found'
            ], 404);
        }

        $filePath = storage_path('app/public/' . $booking->payment_proof_path);

        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'Payment proof file not found'
            ], 404);
        }

        return response()->download($filePath, "payment_proof_{$booking->booking_reference}.pdf");
    }

    /**
     * Bulk update booking statuses
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_ids' => 'required|array',
            'booking_ids.*' => 'exists:b2b_bookings,id',
            'status' => 'required|in:confirmed,rejected',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updatedCount = 0;
            $adminId = auth()->id();

            foreach ($request->booking_ids as $bookingId) {
                $booking = B2BBooking::find($bookingId);

                if ($booking) {
                    if ($request->status === 'confirmed') {
                        $booking->markConfirmed($adminId, $request->notes);
                        $this->sendConfirmation($booking);
                    } else {
                        $booking->markRejected($adminId, $request->notes);
                        $this->sendRejection($booking);
                    }

                    $updatedCount++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully updated {$updatedCount} bookings",
                'updated_count' => $updatedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
