<?php

use App\Models\B2cTravelPackage;
use Illuminate\Support\Carbon;

it('opens registration when admin status is open regardless of deadline', function () {
    config(['app.timezone' => 'Asia/Jakarta']);
    Carbon::setTestNow(Carbon::parse('2030-01-01 12:00:00', 'Asia/Jakarta'));

    $pkg = new B2cTravelPackage([
        'status' => 'open',
        'pax_capacity' => 10,
        'pax_booked' => 0,
        'registration_deadline' => Carbon::parse('2020-01-01 00:00:00', 'Asia/Jakarta'),
    ]);

    expect($pkg->isOpenForRegistration())->toBeTrue();
    expect($pkg->registrationBlockReason())->toBeNull();

    Carbon::setTestNow();
});

it('blocks registration form when admin status is closed', function () {
    $pkg = new B2cTravelPackage([
        'status' => 'closed',
        'pax_capacity' => 10,
        'pax_booked' => 0,
        'registration_deadline' => now()->addYear(),
    ]);

    expect($pkg->isOpenForRegistration())->toBeFalse();
    expect($pkg->registrationBlockReason())->toBe('manual');
});
