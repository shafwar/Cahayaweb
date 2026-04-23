<?php

use App\Http\Controllers\Admin\AdminEntryController;
use App\Http\Controllers\Admin\B2cTravelPackageAdminController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AgentVerificationController;
use App\Http\Controllers\B2b\B2bPortalController;
use App\Http\Controllers\B2cPageController;
use App\Http\Controllers\B2cPublicPackageController;
use App\Http\Controllers\B2cRegistrationApiController;
use App\Http\Controllers\B2cRegistrationController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\SystemDiagnosticsController;
use Illuminate\Support\Facades\Route;

// Admin login page - accessible without auth
Route::get('/admin', [AdminEntryController::class, 'show'])->name('admin.dashboard');

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

    // B2C travel packages & registrations (admin workflow)
    Route::get('/admin/b2c-packages', [B2cTravelPackageAdminController::class, 'index'])->name('admin.b2c-packages.index');
    Route::get('/admin/b2c-packages/create', [B2cTravelPackageAdminController::class, 'create'])->name('admin.b2c-packages.create');
    Route::get('/admin/b2c-packages/registration-feed', [B2cTravelPackageAdminController::class, 'registrationFeed'])
        ->middleware('throttle:90,1')
        ->name('admin.b2c-packages.registration-feed');
    Route::post('/admin/b2c-packages/upload-image', [B2cTravelPackageAdminController::class, 'uploadImage'])
        ->middleware('throttle:30,1')
        ->name('admin.b2c-packages.upload-image');
    Route::post('/admin/b2c-packages', [B2cTravelPackageAdminController::class, 'store'])->name('admin.b2c-packages.store');
    Route::get('/admin/b2c-packages/{b2cTravelPackage}/edit', [B2cTravelPackageAdminController::class, 'edit'])->name('admin.b2c-packages.edit');
    Route::put('/admin/b2c-packages/{b2cTravelPackage}', [B2cTravelPackageAdminController::class, 'update'])->name('admin.b2c-packages.update');
    Route::delete('/admin/b2c-packages/{b2cTravelPackage}', [B2cTravelPackageAdminController::class, 'destroy'])->name('admin.b2c-packages.destroy');
    Route::get('/admin/b2c-packages/{b2cTravelPackage}/registrations', [B2cTravelPackageAdminController::class, 'registrations'])->name('admin.b2c-packages.registrations');
});

Route::get('/debug', [SystemDiagnosticsController::class, 'debug']);

Route::get('/health', [SystemDiagnosticsController::class, 'health']);

Route::get('/robots.txt', [SeoController::class, 'robotsTxt']);

Route::get('/sitemap.xml', [SeoController::class, 'sitemapXml']);

Route::get('/', [B2cPageController::class, 'root'])->name('home');

Route::get('/select-mode', [B2cPageController::class, 'selectMode'])->name('select-mode');

Route::get('/home', [B2cPageController::class, 'home'])->name('b2c.home');

Route::get('/about', [B2cPageController::class, 'about'])->name('b2c.about');
Route::get('/destinations', [B2cPageController::class, 'destinations'])->name('b2c.destinations');
Route::get('/packages/register/{b2cTravelPackage}', [B2cRegistrationController::class, 'create'])->name('b2c.packages.register');
Route::post('/packages/register/{b2cTravelPackage}', [B2cRegistrationController::class, 'store'])->name('b2c.packages.register.store');
Route::post('/api/registrations', [B2cRegistrationApiController::class, 'store'])
    ->middleware('throttle:30,1')
    ->name('api.b2c.registrations.store');
Route::get('/packages', [B2cPublicPackageController::class, 'index'])->name('b2c.packages');
Route::get('/packages/{slug}', [B2cPageController::class, 'packageShow'])->name('b2c.packages.show');
Route::get('/highlights', [B2cPageController::class, 'highlights'])->name('b2c.highlights');
Route::get('/blog', [B2cPageController::class, 'blogIndex'])->name('b2c.blog');
Route::get('/blog/{id}', [B2cPageController::class, 'blogShow'])->name('b2c.blog.show');
Route::get('/contact', [B2cPageController::class, 'contact'])->name('b2c.contact');
Route::get('/search', [B2cPageController::class, 'search'])->name('b2c.search');

Route::get('/b2b/register', [AgentVerificationController::class, 'create'])->name('b2b.register');
Route::post('/b2b/register', [AgentVerificationController::class, 'store'])->name('b2b.register.store');
Route::get('/b2b/register/continue', [AgentVerificationController::class, 'storeContinue'])->name('b2b.register.store.continue')->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/b2b/pending', [AgentVerificationController::class, 'pending'])->name('b2b.pending');
});

Route::middleware('verify.b2b')->group(function () {
    Route::get('/b2b', [B2bPortalController::class, 'index'])->name('b2b.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
