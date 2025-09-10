<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminMessage;
use App\Models\AuditLog;
use App\Models\B2BBooking;
use App\Models\B2BVerification;
use App\Models\Package;
use App\Models\Purchase;
use App\Models\User;
use App\Services\B2BVerificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    protected B2BVerificationService $b2bService;

    public function __construct(B2BVerificationService $b2bService)
    {
        $this->b2bService = $b2bService;
    }
    public function dashboard(): Response
    {
        // Real-time statistics
        $stats = [
            'total_users' => User::count(),
            'b2b_users' => User::whereHas('userType', function ($query) {
                $query->where('name', 'b2b');
            })->count(),
            'b2c_users' => User::whereHas('userType', function ($query) {
                $query->where('name', 'b2c');
            })->count(),
            'admin_users' => User::whereHas('userType', function ($query) {
                $query->where('name', 'admin');
            })->count(),
            'pending_verifications' => B2BVerification::where('status', 'pending')->count(),
            'approved_verifications' => B2BVerification::where('status', 'approved')->count(),
            'rejected_verifications' => B2BVerification::where('status', 'rejected')->count(),
            'total_packages' => Package::count(),
            'active_packages' => Package::where('is_active', true)->count(),
            'inactive_packages' => Package::where('is_active', false)->count(),
            'total_purchases' => Purchase::count(),
            'pending_purchases' => Purchase::where('status', 'pending')->count(),
            'confirmed_purchases' => Purchase::where('status', 'confirmed')->count(),
            'paid_purchases' => Purchase::where('status', 'paid')->count(),
            'completed_purchases' => Purchase::where('status', 'completed')->count(),
            'cancelled_purchases' => Purchase::where('status', 'cancelled')->count(),
            'total_revenue' => Purchase::where('status', 'paid')->sum('total_amount'),
            'monthly_revenue' => Purchase::where('status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->sum('total_amount'),
            // B2B Bookings Statistics
            'total_b2b_bookings' => B2BBooking::count(),
            'pending_b2b_bookings' => B2BBooking::where('status', 'pending')->count(),
            'confirmed_b2b_bookings' => B2BBooking::where('status', 'confirmed')->count(),
            'rejected_b2b_bookings' => B2BBooking::where('status', 'rejected')->count(),
            'b2b_revenue' => B2BBooking::where('status', 'confirmed')->sum('final_amount'),
        ];

        // Recent activity
        $recentUsers = User::with('userType', 'b2bVerification')
            ->latest()
            ->take(5)
            ->get();

        $pendingVerifications = B2BVerification::with('user')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get();

        $recentPurchases = Purchase::with(['user', 'package'])
            ->latest()
            ->take(5)
            ->get();

        $recentB2BBookings = B2BBooking::with(['partner', 'package'])
            ->latest()
            ->take(5)
            ->get();

        // Monthly user growth
        $monthlyUserGrowth = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Top packages by sales
        $topPackages = Package::withCount(['purchases as total_sales'])
            ->withSum(['purchases as total_revenue'], 'total_amount')
            ->orderByDesc('total_sales')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'pendingVerifications' => $pendingVerifications,
            'recentPurchases' => $recentPurchases,
            'recentB2BBookings' => $recentB2BBookings,
            'monthlyUserGrowth' => $monthlyUserGrowth,
            'topPackages' => $topPackages,
        ]);
    }

    public function users(Request $request): Response
    {
        $query = User::with('userType', 'b2bVerification');

        // Filter by user type
        if ($request->has('user_type') && $request->user_type !== 'all') {
            $query->whereHas('userType', function ($q) use ($request) {
                $q->where('name', $request->user_type);
            });
        }

        // Filter by verification status
        if ($request->has('verification_status') && $request->verification_status !== 'all') {
            if ($request->verification_status === 'not_applied') {
                $query->whereDoesntHave('b2bVerification');
            } else {
                $query->whereHas('b2bVerification', function ($q) use ($request) {
                    $q->where('status', $request->verification_status);
                });
            }
        }

        // Search by name or email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('b2bVerification', function ($subQ) use ($search) {
                      $subQ->where('company_name', 'like', "%{$search}%");
                  });
            });
        }

        $users = $query->latest()->paginate(15);

        // Get user type statistics
        $userTypeStats = User::selectRaw('user_types.name, COUNT(*) as count')
            ->join('user_types', 'users.user_type_id', '=', 'user_types.id')
            ->groupBy('user_types.name', 'user_types.id')
            ->get();

        // Get verification status statistics
        $verificationStats = B2BVerification::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => $request->only(['user_type', 'verification_status', 'search']),
            'userTypeStats' => $userTypeStats,
            'verificationStats' => $verificationStats,
        ]);
    }

    public function verifications(Request $request): Response
    {
        $query = B2BVerification::with(['user', 'approvedBy', 'rejectedBy']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by company name or user name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%")
                  ->orWhere('contact_email', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%")
                           ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $verifications = $query->latest()->paginate(15);

        // Get verification statistics
        $verificationStats = B2BVerification::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Get recent audit logs for verifications
        $recentAuditLogs = AuditLog::with(['admin', 'user'])
            ->where('model_type', B2BVerification::class)
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Admin/Verifications', [
            'verifications' => $verifications,
            'filters' => $request->only(['status', 'search']),
            'verificationStats' => $verificationStats,
            'recentAuditLogs' => $recentAuditLogs,
        ]);
    }

    public function approveVerification(Request $request, B2BVerification $verification)
    {
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        try {
            $this->b2bService->approve(
                $verification,
                auth()->user(),
                $request->admin_notes
            );

            return back()->with('success', 'B2B verification approved successfully. User has been notified.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to approve verification. Please try again.');
        }
    }

    public function rejectVerification(Request $request, B2BVerification $verification)
    {
        $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        try {
            $this->b2bService->reject(
                $verification,
                auth()->user(),
                $request->admin_notes
            );

            return back()->with('success', 'B2B verification rejected. User has been notified.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to reject verification. Please try again.');
        }
    }

    public function pendingVerification(Request $request, B2BVerification $verification)
    {
        $request->validate([
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        try {
            // Update verification status to pending
            $verification->update([
                'status' => 'pending',
                'admin_notes' => $request->admin_notes,
                'pending_at' => now(),
                'pending_by' => auth()->id(),
                'approved_at' => null,
                'approved_by' => null,
                'rejected_at' => null,
                'rejected_by' => null,
            ]);

            // Log audit trail
            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'b2b_verification_pending',
                'target_type' => 'B2BVerification',
                'target_id' => $verification->id,
                'details' => [
                    'verification_id' => $verification->id,
                    'user_id' => $verification->user_id,
                    'company_name' => $verification->company_name,
                    'reason' => $request->admin_notes,
                ],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return back()->with('success', 'B2B verification status set to pending.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to set verification to pending. Please try again.');
        }
    }

    public function purchases(Request $request): Response
    {
        // Get both regular purchases and B2B bookings
        $purchaseQuery = Purchase::with(['user', 'package']);
        $b2bQuery = B2BBooking::with(['partner', 'package']);

        // Apply filters to both queries
        if ($request->has('status') && $request->status !== 'all') {
            $purchaseQuery->where('status', $request->status);
            $b2bQuery->where('status', $request->status);
        }

        if ($request->has('date_from') && $request->date_from) {
            $purchaseQuery->whereDate('created_at', '>=', $request->date_from);
            $b2bQuery->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $purchaseQuery->whereDate('created_at', '<=', $request->date_to);
            $b2bQuery->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $purchaseQuery->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhereHas('package', function ($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%");
                  });
            });
            $b2bQuery->where(function ($q) use ($search) {
                $q->where('booking_reference', 'like', "%{$search}%")
                  ->orWhere('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('partner', function ($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%")
                           ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('package', function ($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $purchases = $purchaseQuery->latest()->get();
        $b2bBookings = $b2bQuery->latest()->get();

        // Combine and format data for display
        $allOrders = collect();

        // Add regular purchases
        foreach ($purchases as $purchase) {
            $allOrders->push([
                'id' => 'purchase_' . $purchase->id,
                'type' => 'purchase',
                'customer_name' => $purchase->customer_name,
                'customer_email' => $purchase->customer_email,
                'package_name' => $purchase->package->name,
                'amount' => $purchase->total_amount,
                'status' => $purchase->status,
                'payment_status' => $purchase->payment_status ?? 'pending',
                'created_at' => $purchase->created_at,
                'original' => $purchase
            ]);
        }

        // Add B2B bookings
        foreach ($b2bBookings as $booking) {
            $allOrders->push([
                'id' => 'b2b_' . $booking->id,
                'type' => 'b2b_booking',
                'customer_name' => $booking->partner->name,
                'customer_email' => $booking->partner->email,
                'package_name' => $booking->package->name,
                'amount' => $booking->final_amount,
                'status' => $booking->status,
                'payment_status' => $booking->status === 'confirmed' ? 'paid' : 'pending',
                'created_at' => $booking->created_at,
                'original' => $booking
            ]);
        }

        // Sort by created_at and paginate
        $allOrders = $allOrders->sortByDesc('created_at')->values();
        $perPage = 15;
        $currentPage = $request->get('page', 1);
        $offset = ($currentPage - 1) * $perPage;
        $paginatedOrders = $allOrders->slice($offset, $perPage)->values();

        // Get combined purchase statistics (regular purchases + B2B bookings)
        $purchaseStats = [
            'total' => Purchase::count() + B2BBooking::count(),
            'total_revenue' => Purchase::where('status', 'paid')->sum('total_amount') + B2BBooking::where('status', 'confirmed')->sum('final_amount'),
            'pending' => Purchase::where('status', 'pending')->count() + B2BBooking::where('status', 'pending')->count(),
            'confirmed' => Purchase::where('status', 'confirmed')->count() + B2BBooking::where('status', 'confirmed')->count(),
            'paid' => Purchase::where('status', 'paid')->count() + B2BBooking::where('status', 'confirmed')->count(),
            'completed' => Purchase::where('status', 'completed')->count(),
            'cancelled' => Purchase::where('status', 'cancelled')->count() + B2BBooking::where('status', 'rejected')->count(),
            'monthly_revenue' => Purchase::where('status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->sum('total_amount') + B2BBooking::where('status', 'confirmed')
                ->whereMonth('created_at', now()->month)
                ->sum('final_amount'),
        ];

        // Get purchase status distribution
        $purchaseStatusStats = Purchase::selectRaw('status, COUNT(*) as count, SUM(total_amount) as total_amount')
            ->groupBy('status')
            ->get();

        return Inertia::render('Admin/Purchases', [
            'purchases' => $paginatedOrders,
            'allOrders' => $allOrders,
            'filters' => $request->only(['status', 'search', 'date_from', 'date_to']),
            'purchaseStats' => $purchaseStats,
            'purchaseStatusStats' => $purchaseStatusStats,
            'pagination' => [
                'current_page' => $currentPage,
                'per_page' => $perPage,
                'total' => $allOrders->count(),
                'last_page' => ceil($allOrders->count() / $perPage),
            ],
        ]);
    }

    public function updatePurchaseStatus(Request $request, Purchase $purchase)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,paid,cancelled,completed,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $purchase->update([
            'status' => $request->status,
            'paid_at' => $request->status === 'paid' ? now() : null,
            'admin_notes' => $request->admin_notes,
            'processed_at' => now(),
        ]);

        // Send notification to customer if status changed
        if (in_array($request->status, ['confirmed', 'rejected'])) {
            // Here you can add email/WhatsApp notification logic
            \Log::info("Purchase {$purchase->id} status updated to {$request->status}");
        }

        return back()->with('success', 'Purchase status updated successfully.');
    }

    public function packages(Request $request): Response
    {
        $query = Package::withCount(['purchases as total_sales'])
            ->withSum(['purchases as total_revenue'], 'total_amount');

        // Filter by status
        if ($request->has('is_active') && $request->is_active !== 'all') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by type
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Search by name or destination
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('destination', 'like', "%{$search}%");
            });
        }

        $packages = $query->latest()->paginate(15);

        // Get package statistics
        $packageStats = [
            'total' => Package::count(),
            'active' => Package::where('is_active', true)->count(),
            'inactive' => Package::where('is_active', false)->count(),
            'total_revenue' => Package::withSum(['purchases as total_revenue'], 'total_amount')
                ->get()
                ->sum('total_revenue'),
            'total_sales' => Package::withCount(['purchases as total_sales'])
                ->get()
                ->sum('total_sales'),
        ];

        // Get package types
        $packageTypes = Package::selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->get();

        return Inertia::render('Admin/Packages', [
            'packages' => $packages,
            'filters' => $request->only(['is_active', 'type', 'search']),
            'packageStats' => $packageStats,
            'packageTypes' => $packageTypes,
        ]);
    }

    public function analytics(): Response
    {
        // User growth over time
        $userGrowth = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Revenue over time
        $revenueGrowth = Purchase::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total_amount) as revenue')
            ->where('status', 'paid')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Package performance
        $packagePerformance = Package::withCount(['purchases as total_sales'])
            ->withSum(['purchases as total_revenue'], 'total_amount')
            ->orderByDesc('total_sales')
            ->take(10)
            ->get();

        // User type distribution
        $userTypeDistribution = User::selectRaw('user_types.name, COUNT(*) as count')
            ->join('user_types', 'users.user_type_id', '=', 'user_types.id')
            ->groupBy('user_types.name', 'user_types.id')
            ->get();

        // Purchase status distribution
        $purchaseStatusDistribution = Purchase::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        // Top customers by spending
        $topCustomers = Purchase::selectRaw('customer_name, customer_email, COUNT(*) as total_orders, SUM(total_amount) as total_spent')
            ->where('status', 'paid')
            ->groupBy('customer_name', 'customer_email')
            ->orderByDesc('total_spent')
            ->take(10)
            ->get();

        // Monthly statistics
        $monthlyStats = [
            'new_users' => User::whereMonth('created_at', now()->month)->count(),
            'new_purchases' => Purchase::whereMonth('created_at', now()->month)->count(),
            'monthly_revenue' => Purchase::where('status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->sum('total_amount'),
            'pending_verifications' => B2BVerification::where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Analytics', [
            'userGrowth' => $userGrowth,
            'revenueGrowth' => $revenueGrowth,
            'packagePerformance' => $packagePerformance,
            'userTypeDistribution' => $userTypeDistribution,
            'purchaseStatusDistribution' => $purchaseStatusDistribution,
            'topCustomers' => $topCustomers,
            'monthlyStats' => $monthlyStats,
        ]);
    }

    public function settings(): Response
    {
        // Get system statistics
        $systemStats = [
            'total_users' => User::count(),
            'total_packages' => Package::count(),
            'total_purchases' => Purchase::count(),
            'total_revenue' => Purchase::where('status', 'paid')->sum('total_amount'),
            'pending_verifications' => B2BVerification::where('status', 'pending')->count(),
            'system_uptime' => now()->diffInDays(now()->subDays(30)),
        ];

        // Get recent system activities
        $recentActivities = AuditLog::with(['admin', 'user'])
            ->latest()
            ->take(20)
            ->get();

        // Get user type statistics
        $userTypeStats = User::selectRaw('user_types.name, COUNT(*) as count')
            ->join('user_types', 'users.user_type_id', '=', 'user_types.id')
            ->groupBy('user_types.name', 'user_types.id')
            ->get();

        return Inertia::render('Admin/Settings', [
            'systemStats' => $systemStats,
            'recentActivities' => $recentActivities,
            'userTypeStats' => $userTypeStats,
        ]);
    }

    public function showUser(User $user): Response
    {
        $user->load(['userType', 'b2bVerification', 'purchases.package']);

        $userStats = [
            'total_purchases' => $user->purchases()->count(),
            'total_spent' => $user->purchases()->where('status', 'paid')->sum('total_amount'),
            'pending_purchases' => $user->purchases()->where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'userStats' => $userStats,
        ]);
    }

    public function showVerification(B2BVerification $verification): Response
    {
        $verification->load(['user', 'approvedBy', 'rejectedBy']);

        return Inertia::render('Admin/Verifications/Show', [
            'verification' => $verification,
        ]);
    }

    public function showPackage(Package $package): Response
    {
        $package->load(['purchases.user']);

        $packageStats = [
            'total_sales' => $package->purchases()->count(),
            'total_revenue' => $package->purchases()->where('status', 'paid')->sum('total_amount'),
            'pending_sales' => $package->purchases()->where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Packages/Show', [
            'package' => $package,
            'packageStats' => $packageStats,
        ]);
    }

    public function storePackage(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'b2b_price' => 'required|numeric|min:0',
            'destination' => 'required|string|max:255',
            'duration_days' => 'required|integer|min:1',
            'max_capacity' => 'required|integer|min:1',
            'type' => 'required|string|max:50',
            'is_active' => 'boolean',
        ]);

        Package::create($request->all());

        return back()->with('success', 'Package created successfully.');
    }

    public function updatePackage(Request $request, Package $package)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'b2b_price' => 'required|numeric|min:0',
            'destination' => 'required|string|max:255',
            'duration_days' => 'required|integer|min:1',
            'max_capacity' => 'required|integer|min:1',
            'type' => 'required|string|max:50',
            'is_active' => 'boolean',
        ]);

        $package->update($request->all());

        return back()->with('success', 'Package updated successfully.');
    }

    public function deletePackage(Package $package)
    {
        $package->delete();

        return back()->with('success', 'Package deleted successfully.');
    }

    public function showPurchase(Purchase $purchase): Response
    {
        $purchase->load(['user', 'package']);

        return Inertia::render('Admin/Purchases/Show', [
            'purchase' => $purchase,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'site_name' => 'required|string|max:255',
            'contact_email' => 'required|email',
            'maintenance_mode' => 'boolean',
        ]);

        // Update settings logic here
        // For now, just return success
        return back()->with('success', 'Settings updated successfully.');
    }

    public function editUser(User $user): Response
    {
        $user->load(['userType', 'b2bVerification']);

        $userTypes = \App\Models\UserType::all();

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'userTypes' => $userTypes,
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'user_type_id' => 'required|exists:user_types,id',
        ]);

        $user->update($request->only(['name', 'email', 'user_type_id']));

        return back()->with('success', 'User updated successfully.');
    }

    public function destroyUser(User $user)
    {
        try {
            $userName = $user->name;

            // Delete related records first
            if ($user->b2bVerification) {
                $user->b2bVerification->delete();
            }

            if ($user->purchases) {
                $user->purchases()->delete();
            }

            // Delete the user
            $user->delete();

            // Log audit trail
            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'user_deleted',
                'target_type' => 'User',
                'target_id' => $user->id,
                'details' => [
                    'deleted_user_name' => $userName,
                    'deleted_user_email' => $user->email,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return back()->with('success', "User {$userName} has been deleted successfully.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete user. Please try again.');
        }
    }

    public function toggleUserStatus(User $user)
    {
        try {
            $action = request()->input('action');
            $reason = request()->input('reason', '');

            switch ($action) {
                case 'activate':
                    $user->update(['is_active' => true]);
                    $message = "User {$user->name} has been activated.";
                    $actionType = 'user_activated';
                    break;

                case 'deactivate':
                    $user->update(['is_active' => false]);
                    $message = "User {$user->name} has been deactivated.";
                    $actionType = 'user_deactivated';
                    break;

                case 'suspend':
                    $user->update(['is_suspended' => true, 'suspended_at' => now()]);
                    $message = "User {$user->name} has been suspended.";
                    $actionType = 'user_suspended';
                    break;

                case 'unsuspend':
                    $user->update(['is_suspended' => false, 'suspended_at' => null]);
                    $message = "User {$user->name} has been unsuspended.";
                    $actionType = 'user_unsuspended';
                    break;

                default:
                    return back()->with('error', 'Invalid action specified.');
            }

            // Log audit trail
            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => $actionType,
                'target_type' => 'User',
                'target_id' => $user->id,
                'details' => [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'action' => $action,
                    'reason' => $reason,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update user status. Please try again.');
        }
    }

    public function changeUserType(User $user)
    {
        try {
            $newUserType = request()->input('user_type');
            $reason = request()->input('reason', '');

            // Validate user type
            $userType = \App\Models\UserType::where('name', $newUserType)->first();
            if (!$userType) {
                return back()->with('error', 'Invalid user type specified.');
            }

            $oldUserType = $user->userType->name;

            // Update user type
            $user->update(['user_type_id' => $userType->id]);

            // If changing to B2B, create verification record
            if ($newUserType === 'B2B' && !$user->b2bVerification) {
                \App\Models\B2BVerification::create([
                    'user_id' => $user->id,
                    'company_name' => $user->name . ' Company',
                    'company_address' => 'Address to be updated',
                    'business_license_number' => 'LIC-' . time(),
                    'contact_person' => $user->name,
                    'contact_phone' => 'Phone to be updated',
                    'contact_email' => $user->email,
                    'status' => 'pending',
                    'pending_at' => now(),
                ]);
            }

            // Log audit trail
            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'user_type_changed',
                'target_type' => 'User',
                'target_id' => $user->id,
                'details' => [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'old_type' => $oldUserType,
                    'new_type' => $newUserType,
                    'reason' => $reason,
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return back()->with('success', "User {$user->name} type changed from {$oldUserType} to {$newUserType}.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to change user type. Please try again.');
        }
    }

    public function forceDeleteUser(User $user)
    {
        try {
            $userName = $user->name;
            $userEmail = $user->email;

            // Delete related records first
            if ($user->b2bVerification) {
                $user->b2bVerification->delete();
            }

            if ($user->purchases) {
                $user->purchases()->delete();
            }

            // Delete the user
            $user->delete();

            // Log audit trail
            AuditLog::create([
                'user_id' => auth()->id(),
                'action' => 'user_force_deleted',
                'target_type' => 'User',
                'target_id' => $user->id,
                'details' => [
                    'deleted_user_name' => $userName,
                    'deleted_user_email' => $userEmail,
                    'reason' => request()->input('reason', 'Admin force delete'),
                ],
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            return back()->with('success', "User {$userName} has been permanently deleted.");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete user. Please try again.');
        }
    }

    public function resendVerification(User $user)
    {
        // Resend email verification if user hasn't verified
        if (!$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
            return back()->with('success', 'Verification email sent successfully.');
        }

        return back()->with('info', 'User email is already verified.');
    }

    public function messages(Request $request): Response
    {
        $messages = \App\Models\AdminMessage::with('user')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Messages', [
            'messages' => $messages,
        ]);
    }

    public function createMessage(Request $request): Response
    {
        $users = User::where('id', '!=', auth()->id())->get();

        return Inertia::render('Admin/Messages/Create', [
            'users' => $users,
            'selectedUserId' => $request->user_id,
        ]);
    }

    public function storeMessage(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
        ]);

        \App\Models\AdminMessage::create([
            'admin_id' => auth()->id(),
            'user_id' => $request->user_id,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'sent',
        ]);

        return redirect()->route('admin.messages')->with('success', 'Message sent successfully.');
    }
}
