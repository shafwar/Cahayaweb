<?php

use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('allows owner to upload payment proof when unpaid', function () {
    Storage::fake();

    $user = User::factory()->create();
    $package = B2cTravelPackage::query()->create([
        'slug' => 'pkg-proof-owner',
        'package_code' => 'PKG-OWNER',
        'name' => 'Owner Package',
        'departure_period' => 'Jan 2027',
        'description' => 'desc',
        'location' => 'Makkah',
        'duration_label' => '9 Hari',
        'package_type' => 'umroh',
        'price_display' => '$1000',
        'pax_capacity' => 40,
        'pax_booked' => 0,
        'registration_deadline' => now()->addDays(10),
        'terms_and_conditions' => 'ok',
        'status' => 'open',
    ]);
    $registration = B2cPackageRegistration::query()->create([
        'user_id' => $user->id,
        'b2c_travel_package_id' => $package->id,
        'full_name' => 'Owner',
        'email' => $user->email,
        'phone' => '08123',
        'passport_number' => 'AB123',
        'address' => 'Jl Test',
        'date_of_birth' => '1990-01-01',
        'gender' => 'male',
        'departure_period_snapshot' => 'Jan 2027',
        'pax' => 1,
        'terms_accepted_at' => now(),
        'registration_status' => 'approved',
        'payment_status' => 'unpaid',
    ]);

    $this->actingAs($user)
        ->post(route('b2c.registrations.payment-proof.upload', ['registration' => $registration->id]), [
            'payment_proof' => UploadedFile::fake()->image('proof.png'),
            'payment_note' => 'Transfer via mobile banking',
        ])
        ->assertRedirect();

    $registration->refresh();

    expect($registration->payment_status)->toBe('waiting_confirmation')
        ->and($registration->payment_note)->toBe('Transfer via mobile banking')
        ->and($registration->payment_proof)->not->toBeNull()
        ->and($registration->payment_uploaded_at)->not->toBeNull();
});

it('blocks payment proof upload from non owner', function () {
    Storage::fake();

    $owner = User::factory()->create();
    $other = User::factory()->create();
    $package = B2cTravelPackage::query()->create([
        'slug' => 'pkg-proof-other',
        'package_code' => 'PKG-OTHER',
        'name' => 'Other Package',
        'departure_period' => 'Jan 2027',
        'description' => 'desc',
        'location' => 'Madinah',
        'duration_label' => '9 Hari',
        'package_type' => 'umroh',
        'price_display' => '$1000',
        'pax_capacity' => 40,
        'pax_booked' => 0,
        'registration_deadline' => now()->addDays(10),
        'terms_and_conditions' => 'ok',
        'status' => 'open',
    ]);
    $registration = B2cPackageRegistration::query()->create([
        'user_id' => $owner->id,
        'b2c_travel_package_id' => $package->id,
        'full_name' => 'Owner',
        'email' => $owner->email,
        'phone' => '08123',
        'passport_number' => 'AB123',
        'address' => 'Jl Test',
        'date_of_birth' => '1990-01-01',
        'gender' => 'male',
        'departure_period_snapshot' => 'Jan 2027',
        'pax' => 1,
        'terms_accepted_at' => now(),
        'registration_status' => 'approved',
        'payment_status' => 'unpaid',
    ]);

    $this->actingAs($other)
        ->post(route('b2c.registrations.payment-proof.upload', ['registration' => $registration->id]), [
            'payment_proof' => UploadedFile::fake()->image('proof.png'),
        ])
        ->assertNotFound();
});

it('blocks payment proof upload when registration is not approved', function () {
    Storage::fake();

    $user = User::factory()->create();
    $package = B2cTravelPackage::query()->create([
        'slug' => 'pkg-proof-pending',
        'package_code' => 'PKG-PENDING',
        'name' => 'Pending Package',
        'departure_period' => 'Jan 2027',
        'description' => 'desc',
        'location' => 'Madinah',
        'duration_label' => '9 Hari',
        'package_type' => 'umroh',
        'price_display' => '$1000',
        'pax_capacity' => 40,
        'pax_booked' => 0,
        'registration_deadline' => now()->addDays(10),
        'terms_and_conditions' => 'ok',
        'status' => 'open',
    ]);
    $registration = B2cPackageRegistration::query()->create([
        'user_id' => $user->id,
        'b2c_travel_package_id' => $package->id,
        'full_name' => 'Owner',
        'email' => $user->email,
        'phone' => '08123',
        'passport_number' => 'AB123',
        'address' => 'Jl Test',
        'date_of_birth' => '1990-01-01',
        'gender' => 'male',
        'departure_period_snapshot' => 'Jan 2027',
        'pax' => 1,
        'terms_accepted_at' => now(),
        'registration_status' => 'pending',
        'payment_status' => 'unpaid',
    ]);

    $this->actingAs($user)
        ->post(route('b2c.registrations.payment-proof.upload', ['registration' => $registration->id]), [
            'payment_proof' => UploadedFile::fake()->image('proof.png'),
        ])
        ->assertRedirect();

    expect($registration->fresh()->payment_status)->toBe('unpaid');
});

it('allows admin to mark paid and reject waiting confirmation payment', function () {
    $admin = User::factory()->create(['email' => 'ops-admin@test.local']);
    Config::set('app.admin_emails', [$admin->email]);

    $package = B2cTravelPackage::query()->create([
        'slug' => 'pkg-proof-admin',
        'package_code' => 'PKG-ADMIN',
        'name' => 'Admin Package',
        'departure_period' => 'Jan 2027',
        'description' => 'desc',
        'location' => 'Jeddah',
        'duration_label' => '9 Hari',
        'package_type' => 'umroh',
        'price_display' => '$1000',
        'pax_capacity' => 40,
        'pax_booked' => 0,
        'registration_deadline' => now()->addDays(10),
        'terms_and_conditions' => 'ok',
        'status' => 'open',
    ]);
    $registration = B2cPackageRegistration::query()->create([
        'b2c_travel_package_id' => $package->id,
        'user_id' => User::factory()->create()->id,
        'full_name' => 'Customer',
        'email' => 'customer@test.local',
        'phone' => '08123',
        'passport_number' => 'AB123',
        'address' => 'Jl Test',
        'date_of_birth' => '1990-01-01',
        'gender' => 'male',
        'departure_period_snapshot' => 'Jan 2027',
        'pax' => 1,
        'terms_accepted_at' => now(),
        'registration_status' => 'pending',
        'payment_status' => 'waiting_confirmation',
        'payment_proof' => 'b2c/payment-proofs/test.png',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.participants.payment.mark-paid', ['participant' => $registration->id]))
        ->assertRedirect();

    expect($registration->fresh()->payment_status)->toBe('paid');

    $registration->refresh();
    $registration->forceFill(['payment_status' => 'waiting_confirmation'])->save();

    $this->actingAs($admin)
        ->post(route('admin.participants.payment.reject', ['participant' => $registration->id]))
        ->assertRedirect();

    expect($registration->fresh()->payment_status)->toBe('unpaid');
});
