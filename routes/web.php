<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\B2BBookingController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\B2B\BookingController;
use App\Http\Controllers\B2B\PackageController as B2BPackageController;
use App\Http\Controllers\B2BController;
use App\Http\Controllers\B2BVerificationController;
use App\Http\Controllers\PackageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Add this at the very top, before existing routes
Route::get('/debug', function () {
    return response()->json([
        'status' => 'Laravel is running',
        'php_version' => PHP_VERSION,
        'laravel_version' => app()->version(),
        'environment' => app()->environment(),
        'database_path' => config('database.connections.sqlite.database'),
        'database_exists' => file_exists(config('database.connections.sqlite.database')),
        'storage_writable' => is_writable(storage_path()),
        'cache_path' => storage_path('framework/cache'),
        'session_path' => storage_path('framework/sessions'),
        'views_path' => storage_path('framework/views')
    ]);
});

// Health check route for Railway
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'port' => $_ENV['PORT'] ?? '8000'
    ]);
});

Route::get('/', function () {
    // Check if user is authenticated
    if (auth()->check()) {
        $user = auth()->user();

        // Redirect based on user type
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isB2B()) {
            return redirect()->route('b2b.dashboard');
        } else {
            return redirect()->route('user.dashboard');
        }
    }

    // If not authenticated, show select mode
    return Inertia::render('landing/select-mode');
})->name('home');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Public B2C pages (Term 1 UI only)
Route::get('/home', function () {
    return Inertia::render('b2c/home');
})->name('b2c.home');

// User Dashboard (for B2C users)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('user.dashboard');
});

Route::get('/about', fn () => Inertia::render('b2c/about'))->name('b2c.about');
Route::get('/destinations', fn () => Inertia::render('b2c/destinations'))->name('b2c.destinations');
Route::get('/highlights', fn () => Inertia::render('b2c/highlights'))->name('b2c.highlights');
Route::get('/blog', fn () => Inertia::render('b2c/blog/index'))->name('b2c.blog');
Route::get('/blog/{id}', fn ($id) => Inertia::render('b2c/blog/[id]', ['id' => $id]))->name('b2c.blog.show');
Route::get('/contact', fn () => Inertia::render('b2c/contact'))->name('b2c.contact');

// B2B Routes
Route::prefix('b2b')->name('b2b.')->group(function () {
    // Public B2B landing page
    Route::get('/', function () {
    return Inertia::render('b2b/index');
    })->name('index');

    // B2B login page
    Route::get('/login', [AuthController::class, 'showB2BLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');

    // B2B registration page
    Route::get('/register', [AuthController::class, 'showB2BRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);

// B2B dashboard (requires auth and B2B verification)
    Route::middleware(['auth', 'b2b.verification'])->group(function () {
        Route::get('/dashboard', [B2BController::class, 'dashboard'])->name('dashboard');
        Route::get('/profile', [B2BController::class, 'profile'])->name('profile');
    });
});

// B2B Verification Routes
Route::middleware(['auth', 'b2b.verification'])->group(function () {
    Route::get('/b2b/verification/required', [B2BVerificationController::class, 'showVerificationRequired'])
        ->name('b2b.verification.required');
    Route::get('/b2b/verification/form', [B2BVerificationController::class, 'showVerificationForm'])
        ->name('b2b.verification.form');
    Route::post('/b2b/verification/submit', [B2BVerificationController::class, 'submitVerification'])
        ->name('b2b.verification.submit');
    Route::get('/b2b/verification/status', [B2BVerificationController::class, 'showVerificationStatus'])
        ->name('b2b.verification.status');
    Route::get('/b2b/verification/update-form', [B2BVerificationController::class, 'showUpdateForm'])
        ->name('b2b.verification.update.form');
    Route::post('/b2b/verification/update', [B2BVerificationController::class, 'updateApplication'])
        ->name('b2b.verification.update');
});

// Purchase Routes (Requires authentication for logged-in users)
Route::middleware(['auth', 'b2b.verification'])->group(function () {
    Route::post('/packages/{package}/purchase', [PackageController::class, 'purchase'])->name('packages.purchase');
    Route::get('/purchase/{purchase}/confirmation', [PackageController::class, 'purchaseConfirmation'])->name('purchase.confirmation');
    Route::get('/my-purchases', [PackageController::class, 'myPurchases'])->name('my.purchases');
});

// B2B Package Routes (Requires approved B2B verification)
Route::middleware(['auth', 'b2b.package.access'])->group(function () {
    Route::get('/b2b/packages', [B2BPackageController::class, 'index'])->name('b2b.packages');
    Route::get('/b2b/packages/{package}', [B2BPackageController::class, 'show'])->name('b2b.packages.show');

    // B2B Booking Routes
    Route::get('/b2b/booking/create/{package}', [BookingController::class, 'create'])->name('b2b.booking.create');
    Route::get('/b2b/bookings', [BookingController::class, 'index'])->name('b2b.bookings.index');
    Route::post('/b2b/bookings', [BookingController::class, 'store'])->name('b2b.bookings.store');
    Route::get('/b2b/bookings/{booking}', [BookingController::class, 'show'])->name('b2b.bookings.show');
    Route::post('/b2b/bookings/{booking}/upload-proof', [BookingController::class, 'uploadPaymentProof'])->name('b2b.bookings.upload-proof');
    Route::post('/b2b/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('b2b.bookings.cancel');
});

// Allow anonymous purchases (for B2C users who haven't registered yet)
Route::post('/packages/{package}/purchase-anonymous', [PackageController::class, 'purchase'])->name('packages.purchase.anonymous');

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    // B2B Bookings Management
    Route::prefix('b2b-bookings')->name('b2b-bookings.')->group(function () {
        Route::get('/', [B2BBookingController::class, 'index'])->name('index');
        Route::get('/{booking}', [B2BBookingController::class, 'show'])->name('show');
        Route::patch('/{booking}/status', [B2BBookingController::class, 'updateStatus'])->name('update-status');
        Route::post('/{booking}/send-payment-details', [B2BBookingController::class, 'sendPaymentDetails'])->name('send-payment-details');
        Route::post('/{booking}/send-confirmation', [B2BBookingController::class, 'sendConfirmation'])->name('send-confirmation');
        Route::get('/{booking}/download-proof', [B2BBookingController::class, 'downloadPaymentProof'])->name('download-proof');
        Route::post('/bulk-update', [B2BBookingController::class, 'bulkUpdateStatus'])->name('bulk-update');
        Route::get('/api/stats', [B2BBookingController::class, 'getStats'])->name('stats');
        Route::get('/api/recent', [B2BBookingController::class, 'getRecentBookings'])->name('recent');
    });

    // User Management
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/users/{user}', [AdminController::class, 'showUser'])->name('users.show');
    Route::get('/users/{user}/edit', [AdminController::class, 'editUser'])->name('users.edit');
    Route::patch('/users/{user}', [AdminController::class, 'updateUser'])->name('users.update');
    Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->name('users.destroy');
    Route::patch('/users/{user}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('users.toggle-status');
    Route::post('/users/{user}/resend-verification', [AdminController::class, 'resendVerification'])->name('users.resend-verification');
    Route::patch('/users/{user}/change-type', [AdminController::class, 'changeUserType'])->name('users.change-type');
    Route::delete('/users/{user}/force-delete', [AdminController::class, 'forceDeleteUser'])->name('users.force-delete');

    // Verification Management
    Route::get('/verifications', [AdminController::class, 'verifications'])->name('verifications');
    Route::get('/verifications/{verification}', [AdminController::class, 'showVerification'])->name('verifications.show');
    Route::post('/verifications/{verification}/approve', [AdminController::class, 'approveVerification'])->name('verifications.approve');
    Route::post('/verifications/{verification}/reject', [AdminController::class, 'rejectVerification'])->name('verifications.reject');

    // Package Management
    Route::get('/packages', [AdminController::class, 'packages'])->name('packages');
    Route::get('/packages/{package}', [AdminController::class, 'showPackage'])->name('packages.show');
    Route::post('/packages', [AdminController::class, 'storePackage'])->name('packages.store');
    Route::put('/packages/{package}', [AdminController::class, 'updatePackage'])->name('packages.update');
    Route::delete('/packages/{package}', [AdminController::class, 'deletePackage'])->name('packages.delete');

    // Purchase Management
    Route::get('/purchases', [AdminController::class, 'purchases'])->name('purchases');
    Route::get('/purchases/{purchase}', [AdminController::class, 'showPurchase'])->name('purchases.show');
    Route::post('/purchases/{purchase}/status', [AdminController::class, 'updatePurchaseStatus'])->name('purchases.status');

    // Messaging
    Route::get('/messages', [AdminController::class, 'messages'])->name('messages');
    Route::get('/messages/create', [AdminController::class, 'createMessage'])->name('messages.create');
    Route::post('/messages', [AdminController::class, 'storeMessage'])->name('messages.store');

    // Analytics & Settings
    Route::get('/analytics', [AdminController::class, 'analytics'])->name('analytics');
    Route::get('/settings', [AdminController::class, 'settings'])->name('settings');
    Route::post('/settings', [AdminController::class, 'updateSettings'])->name('settings.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('user.dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
