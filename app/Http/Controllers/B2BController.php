<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class B2BController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $user = $request->user()->load(['userType', 'b2bVerification']);

        // Get B2B bookings for this user with package relationship
        $b2bBookings = \App\Models\B2BBooking::where('partner_id', $user->id)
            ->with(['package'])
            ->get();

        // Get real-time statistics with more detailed data
        $totalPackages = Package::where('is_active', true)->whereNotNull('b2b_price')->count();
        $activeBookings = $b2bBookings->where('status', 'confirmed')->count();
        $pendingBookings = $b2bBookings->where('status', 'pending')->count();
        $totalSpent = $b2bBookings->where('status', 'confirmed')->sum('final_amount');

        // Calculate upcoming trips (confirmed bookings with future dates)
        $upcomingTrips = $b2bBookings->where('status', 'confirmed')->count();

        $stats = [
            'total_packages' => $totalPackages,
            'active_bookings' => $activeBookings,
            'pending_bookings' => $pendingBookings,
            'total_spent' => $totalSpent,
            'upcoming_trips' => $upcomingTrips,
            'total_bookings' => $b2bBookings->count(),
        ];

        // Get recent packages (featured packages) with B2B pricing
        $recent_packages = Package::where('is_active', true)
            ->whereNotNull('b2b_price')
            ->select(['id', 'name', 'destination', 'price', 'b2b_price', 'duration_days', 'image_path', 'description'])
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($package) {
                return [
                    'id' => $package->id,
                    'name' => $package->name,
                    'destination' => $package->destination,
                    'price' => $package->b2b_price ?? $package->price,
                    'original_price' => $package->price,
                    'duration_days' => $package->duration_days,
                    'image_path' => $package->image_path,
                    'description' => $package->description,
                    'has_discount' => $package->b2b_price && $package->b2b_price < $package->price,
                    'discount_amount' => $package->b2b_price ? $package->price - $package->b2b_price : 0,
                ];
            });

        // Get recent activity (B2B booking history) with more details
        $recent_activity = $b2bBookings
            ->map(function ($booking) {
                $statusColor = match($booking->status) {
                    'confirmed' => 'text-emerald-600',
                    'pending' => 'text-amber-600',
                    'rejected' => 'text-red-600',
                    default => 'text-slate-600'
                };

                return [
                    'id' => $booking->id,
                    'type' => 'booking',
                    'message' => "Booking #{$booking->booking_reference} - {$booking->package->name}",
                    'sub_message' => "Status: {$booking->status} • Amount: Rp " . number_format($booking->final_amount, 0, ',', '.'),
                    'status' => $booking->status,
                    'status_color' => $statusColor,
                    'created_at' => $booking->created_at->toISOString(),
                ];
            })
            ->sortByDesc('created_at')
            ->take(5);

        // Add verification activity if user is B2B
        if ($user->isB2B() && $user->b2bVerification) {
            $verificationActivity = [
                'id' => 'verification_' . $user->b2bVerification->id,
                'type' => 'verification',
                'message' => "B2B Account Verification",
                'sub_message' => "Status: {$user->b2bVerification->status} for {$user->b2bVerification->company_name}",
                'status' => $user->b2bVerification->status,
                'status_color' => $user->b2bVerification->status === 'approved' ? 'text-emerald-600' : 'text-amber-600',
                'created_at' => $user->b2bVerification->updated_at->toISOString(),
            ];

            $recent_activity->prepend($verificationActivity);
        }

        // Add sample notifications for demo
        $notifications = [
            [
                'id' => 1,
                'message' => 'New package available: Dubai Business Trip with 15% B2B discount',
                'time' => '2 hours ago',
                'type' => 'info'
            ],
            [
                'id' => 2,
                'message' => 'Your booking #CA-B2B-20241215-0001 has been confirmed',
                'time' => '1 day ago',
                'type' => 'success'
            ],
            [
                'id' => 3,
                'message' => 'Payment reminder for booking #CA-B2B-20241214-0002',
                'time' => '2 days ago',
                'type' => 'warning'
            ]
        ];

        return Inertia::render('b2b/dashboard', [
            'user' => $user,
            'stats' => $stats,
            'recent_packages' => $recent_packages,
            'recent_activity' => $recent_activity->take(5),
            'notifications' => $notifications,
        ]);
    }

    public function packages(Request $request): Response
    {
        $user = $request->user()->load(['userType', 'b2bVerification']);

        $packages = Package::where('is_active', true)
            ->whereNotNull('b2b_price')
            ->latest()
            ->paginate(12);

        return Inertia::render('b2b/packages/index', [
            'user' => $user,
            'packages' => $packages,
        ]);
    }

    public function profile(Request $request): Response
    {
        $user = $request->user()->load(['userType', 'b2bVerification']);

        return Inertia::render('b2b/profile', [
            'user' => $user,
        ]);
    }

    public function packageDetails(Request $request, Package $package): Response
    {
        $user = $request->user()->load(['userType', 'b2bVerification']);

        // Check if user can access this package
        if (!$user->isVerified()) {
            abort(403, 'You must be verified to view package details.');
        }

        // Ensure package is active and has B2B pricing
        if (!$package->is_active || !$package->b2b_price) {
            abort(404, 'Package not available for B2B booking');
        }

        // Package data is already loaded

        return Inertia::render('b2b/packages/show', [
            'user' => $user,
            'package' => $package,
        ]);
    }
}
