<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AgentVerificationController;
use Inertia\Inertia;

// Admin login page - accessible without auth
Route::get('/admin', function (Request $request) {
    $user = $request->user();

    // If user is already logged in, check if admin
    if ($user) {
        // Check admin status - use same logic as IsAdmin middleware
        $isAdmin = false;
        if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
            $isAdmin = true;
        }
        if (!$isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
            $isAdmin = true;
        }

        if ($isAdmin) {
            // User is admin - show dashboard
            return Inertia::render('admin/dashboard');
        } else {
            // Non-admin user trying to access admin - show login page with error
            return Inertia::render('auth/login', [
                'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
                'status' => null,
                'mode' => 'admin',
                'redirect' => '/admin',
                'error' => 'You do not have admin access. Please login with an admin account.',
            ]);
        }
    }

    // User not logged in - show admin login page
    return Inertia::render('auth/login', [
        'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
        'status' => null,
        'mode' => 'admin',
        'redirect' => '/admin',
    ]);
})->name('admin.dashboard');

Route::middleware(['auth', 'is_admin'])->group(function () {

    Route::post('/admin/update-section', [AdminController::class, 'updateSection']);
    Route::post('/admin/upload-image', [AdminController::class, 'uploadImage']);
    Route::post('/admin/upload-video', [AdminController::class, 'uploadVideo']);
    Route::get('/admin/revisions', [AdminController::class, 'getRevisions']);
    Route::post('/admin/restore-revision', [AdminController::class, 'restoreRevision']);
    Route::post('/admin/reset-to-default', [AdminController::class, 'resetToDefault']);

    // Agent Verification Management
    // IMPORTANT: More specific routes (with /all) must come BEFORE parameterized routes
    Route::delete('/admin/agent-verifications/all', [AgentVerificationController::class, 'destroyAll'])->name('admin.agent-verifications.destroy-all');
    Route::delete('/admin/agent-verifications', [AgentVerificationController::class, 'destroyMultiple'])->name('admin.agent-verifications.destroy-multiple');

    Route::get('/admin/agent-verifications', [AgentVerificationController::class, 'index'])->name('admin.agent-verifications');
    Route::get('/admin/agent-verifications/{verification}', [AgentVerificationController::class, 'show'])->name('admin.agent-verification.show');
    Route::get('/admin/agent-verifications/{verification}/download/{documentType}', [AgentVerificationController::class, 'downloadDocument'])->name('admin.agent-verification.download');
    Route::post('/admin/agent-verifications/{verification}/approve', [AgentVerificationController::class, 'approve'])->name('admin.agent-verification.approve');
    Route::post('/admin/agent-verifications/{verification}/reject', [AgentVerificationController::class, 'reject'])->name('admin.agent-verification.reject');
    Route::post('/admin/agent-verifications/{verification}/update', [AgentVerificationController::class, 'update'])->name('admin.agent-verification.update');
    Route::delete('/admin/agent-verifications/{verification}', [AgentVerificationController::class, 'destroy'])->name('admin.agent-verification.destroy');
});

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

// Robots.txt for SEO crawlers - Enhanced
Route::get('/robots.txt', function () {
    $baseUrl = config('app.url') ?: request()->getSchemeAndHttpHost();
    $baseUrl = preg_replace('#^http://#', 'https://', $baseUrl);
    $baseUrl = rtrim($baseUrl, '/');

    $content = implode("\n", [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin',
        'Disallow: /b2b/register',
        'Disallow: /b2b/pending',
        'Disallow: /api',
        'Disallow: /debug',
        '',
        '# Sitemap',
        'Sitemap: ' . $baseUrl . '/sitemap.xml',
        '',
        '# Crawl-delay',
        'Crawl-delay: 1',
    ]);

    return response($content, 200)
        ->header('Content-Type', 'text/plain; charset=utf-8')
        ->header('Cache-Control', 'public, max-age=86400');
});

// Sitemap.xml for SEO indexing - Enhanced with priorities and proper lastmod
Route::get('/sitemap.xml', function () {
    $baseUrl = config('app.url') ?: request()->getSchemeAndHttpHost();
    $baseUrl = preg_replace('#^http://#', 'https://', $baseUrl);
    $baseUrl = rtrim($baseUrl, '/');

    // Define URLs with priorities and change frequencies
    $urls = [
        ['path' => '/', 'priority' => '1.0', 'changefreq' => 'daily', 'lastmod' => now()->toAtomString()],
        ['path' => '/home', 'priority' => '0.9', 'changefreq' => 'daily', 'lastmod' => now()->toAtomString()],
        ['path' => '/about', 'priority' => '0.8', 'changefreq' => 'monthly', 'lastmod' => now()->subDays(7)->toAtomString()],
        ['path' => '/destinations', 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
        ['path' => '/packages', 'priority' => '0.9', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
        ['path' => '/highlights', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
        ['path' => '/blog', 'priority' => '0.8', 'changefreq' => 'weekly', 'lastmod' => now()->toAtomString()],
        ['path' => '/contact', 'priority' => '0.7', 'changefreq' => 'monthly', 'lastmod' => now()->subDays(30)->toAtomString()],
    ];

    $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"\n";
    $xml .= "        xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n";
    $xml .= "        xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9\n";
    $xml .= "        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">\n";
    
    foreach ($urls as $url) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($baseUrl . $url['path'], ENT_XML1, 'UTF-8') . "</loc>\n";
        $xml .= "    <lastmod>" . $url['lastmod'] . "</lastmod>\n";
        $xml .= "    <changefreq>" . $url['changefreq'] . "</changefreq>\n";
        $xml .= "    <priority>" . $url['priority'] . "</priority>\n";
        $xml .= "  </url>\n";
    }
    
    $xml .= "</urlset>\n";

    return response($xml, 200)
        ->header('Content-Type', 'application/xml; charset=utf-8')
        ->header('Cache-Control', 'public, max-age=3600');
});

Route::get('/', function () {
    return Inertia::render('landing/select-mode');
})->name('home');

// Public B2C pages (Term 1 UI only)
// Note: PublicLayout will enforce splash screen redirect for direct access
Route::get('/home', function () {
    return Inertia::render('b2c/home');
})->name('b2c.home');

Route::get('/about', fn () => Inertia::render('b2c/about'))->name('b2c.about');
Route::get('/destinations', fn () => Inertia::render('b2c/destinations'))->name('b2c.destinations');
Route::get('/packages', fn () => Inertia::render('b2c/packages/index'))->name('b2c.packages');
Route::get('/packages/{slug}', fn ($slug) => Inertia::render('b2c/packages/show', ['slug' => $slug]))->name('b2c.packages.show');
Route::get('/highlights', fn () => Inertia::render('b2c/highlights'))->name('b2c.highlights');
Route::get('/blog', fn () => Inertia::render('b2c/blog/index'))->name('b2c.blog');
Route::get('/blog/{id}', fn ($id) => Inertia::render('b2c/blog/[id]', ['id' => $id]))->name('b2c.blog.show');
Route::get('/contact', fn () => Inertia::render('b2c/contact'))->name('b2c.contact');
Route::get('/search', fn () => Inertia::render('b2c/search'))->name('b2c.search');

// B2B Agent Verification Routes (public - no login required)
Route::get('/b2b/register', [AgentVerificationController::class, 'create'])->name('b2b.register');
Route::post('/b2b/register', [AgentVerificationController::class, 'store'])->name('b2b.register.store');
Route::get('/b2b/register/continue', [AgentVerificationController::class, 'storeContinue'])->name('b2b.register.store.continue')->middleware('auth');

// B2B Pending page (requires auth to view status)
Route::middleware('auth')->group(function () {
    Route::get('/b2b/pending', [AgentVerificationController::class, 'pending'])->name('b2b.pending');
});

// B2B Portal (verify.b2b middleware will handle auth check and redirect to register if needed)
Route::middleware('verify.b2b')->group(function () {
    Route::get('/b2b', function () {
        return Inertia::render('b2b/index');
    })->name('b2b.index');
});

// Dashboard route removed - users are redirected to home or B2B pages instead
// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
