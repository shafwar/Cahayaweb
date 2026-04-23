<?php

use App\Models\B2cTravelPackage;
use App\Services\B2cPackageRegistrationRegistrar;
use Illuminate\Support\Carbon;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

/**
 * @return array<string, mixed>
 */
function baseB2cPackageAttributes(): array
{
    return [
        'name' => 'Test Package',
        'departure_period' => 'Apr 2026',
        'description' => 'Test description for registration.',
        'location' => 'Makkah & Madinah',
        'duration_label' => '9D8N',
        'package_type' => 'Religious',
        'price_display' => 'Rp 35.000.000',
        'pax_capacity' => 25,
        'pax_booked' => 0,
        'registration_deadline' => Carbon::parse('2020-01-01 00:00:00', config('app.timezone')),
        'terms_and_conditions' => 'Terms apply.',
        'status' => 'open',
        'sort_order' => 0,
    ];
}

function createOpenB2cPackage(array $overrides = []): B2cTravelPackage
{
    $attrs = array_merge(baseB2cPackageAttributes(), $overrides);
    $code = (string) ($attrs['package_code'] ?? 'TEST-'.uniqid());
    $slug = (string) ($attrs['slug'] ?? 'test-pkg-'.uniqid());

    return B2cTravelPackage::query()->create(array_merge($attrs, [
        'slug' => $slug,
        'package_code' => $code,
    ]));
}

it('redirects guests away from registration when package status is closed', function () {
    $pkg = createOpenB2cPackage([
        'slug' => 'closed-reg-slug',
        'package_code' => 'TEST-CLOSED-REG',
        'status' => 'closed',
    ]);

    $this->get(route('b2c.packages.register', ['b2cTravelPackage' => $pkg->slug]))
        ->assertRedirect(route('b2c.packages'));
});

it('shows registration page for open package even when deadline is past', function () {
    $pkg = createOpenB2cPackage([
        'slug' => 'open-reg-slug',
        'package_code' => 'TEST-OPEN-REG',
        'status' => 'open',
    ]);

    expect($pkg->fresh()->isOpenForRegistration())->toBeTrue()
        ->and($pkg->fresh()->status)->toBe('open');

    $this->get(route('b2c.packages.register', ['b2cTravelPackage' => $pkg->slug]))
        ->assertOk();
});

it('does not auto-close package when last seats are booked', function () {
    $pkg = createOpenB2cPackage([
        'slug' => 'full-cap-slug',
        'package_code' => 'TEST-FULL-CAP',
        'pax_capacity' => 2,
        'pax_booked' => 0,
    ]);

    $registrar = app(B2cPackageRegistrationRegistrar::class);
    $registrar->register($pkg, [
        'full_name' => 'Tester Satu',
        'email' => 'tester-full-cap@example.com',
        'phone' => '081234567890',
        'passport_number' => 'A1234567',
        'address' => 'Jl. Contoh 1',
        'date_of_birth' => '1990-06-15',
        'gender' => 'male',
        'pax' => 2,
    ]);

    $pkg->refresh();

    expect($pkg->pax_booked)->toBe(2);
    expect($pkg->status)->toBe('open');
});

it('normalizes status casing on save', function () {
    $pkg = createOpenB2cPackage([
        'slug' => 'normalize-status-slug',
        'package_code' => 'TEST-NORM-STATUS',
        'status' => 'open',
    ]);

    $pkg->status = 'OPEN ';
    $pkg->save();

    expect($pkg->fresh()->status)->toBe('open');
});
