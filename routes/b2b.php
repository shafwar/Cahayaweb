<?php

use App\Http\Controllers\B2B\BookingController;
use App\Http\Controllers\B2B\PackageController;
use App\Http\Controllers\B2B\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| B2B Routes
|--------------------------------------------------------------------------
|
| Here is where you can register B2B routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // B2B Bookings
    Route::prefix('b2b')->name('b2b.')->group(function () {
        // Booking routes
        Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
        Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
        Route::get('/bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
        Route::post('/bookings/{booking}/upload-proof', [BookingController::class, 'uploadPaymentProof'])->name('bookings.upload-proof');
        Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');

        // Booking creation flow
        Route::get('/booking/create/{package}', [BookingController::class, 'create'])->name('booking.create');

        // Package routes
        Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');
        Route::get('/packages/{package}', [PackageController::class, 'show'])->name('packages.show');

        // Profile routes
        Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
        Route::post('/profile/update', [ProfileController::class, 'updateProfile'])->name('profile.update');
        Route::post('/password/update', [ProfileController::class, 'updatePassword'])->name('password.update');
        Route::post('/company/update', [ProfileController::class, 'updateCompany'])->name('company.update');
    });
});
