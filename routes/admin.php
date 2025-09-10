<?php

use App\Http\Controllers\Admin\B2BBookingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
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
});
