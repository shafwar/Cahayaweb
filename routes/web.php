<?php

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
    return Inertia::render('landing/select-mode');
})->name('home');

// Public B2C pages (Term 1 UI only)
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

// Simple B2B view
Route::get('/b2b', function () {
    return Inertia::render('b2b/index');
})->name('b2b.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
