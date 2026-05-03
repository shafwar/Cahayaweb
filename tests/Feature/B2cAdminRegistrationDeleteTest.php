<?php

use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function adminUserForDelete(): User
{
    $admin = User::factory()->create(['email' => 'admin-b2c-del-'.uniqid().'@test.local']);
    Config::set('app.admin_emails', [$admin->email]);

    return $admin;
}

function createAdminDeletePackage(array $overrides = []): B2cTravelPackage
{
    $code = $overrides['package_code'] ?? 'ADM-DEL-'.uniqid();

    return B2cTravelPackage::query()->create(array_merge([
        'slug' => $overrides['slug'] ?? 'adm-del-'.uniqid(),
        'package_code' => $code,
        'name' => 'Admin delete test package',
        'departure_period' => 'Apr 2026',
        'description' => 'Test.',
        'location' => 'Makkah',
        'duration_label' => '9D8N',
        'package_type' => 'Religious',
        'price_display' => 'Rp 1',
        'pax_capacity' => 25,
        'pax_booked' => 3,
        'registration_deadline' => Carbon::parse('2026-04-01', config('app.timezone')),
        'terms_and_conditions' => 'T.',
        'status' => 'open',
        'sort_order' => 0,
    ], $overrides));
}

function makeRegistration(B2cTravelPackage $pkg, User $user, int $pax = 2): B2cPackageRegistration
{
    return B2cPackageRegistration::query()->create([
        'b2c_travel_package_id' => $pkg->id,
        'user_id' => $user->id,
        'full_name' => 'Participant One',
        'email' => $user->email,
        'phone' => '081234567890',
        'passport_number' => 'P1234567',
        'address' => 'Jl Test',
        'date_of_birth' => '1990-05-05',
        'gender' => 'male',
        'departure_period_snapshot' => $pkg->departure_period,
        'pax' => $pax,
        'registration_status' => 'pending',
        'payment_status' => 'unpaid',
        'visa_status' => 'not_processed',
        'ticket_status' => 'not_booked',
        'hotel_status' => 'not_assigned',
        'terms_accepted_at' => now(),
    ]);
}

it('admin deletes one b2c registration and decrements pax_booked without deleting user', function () {
    $admin = adminUserForDelete();
    $pkg = createAdminDeletePackage(['pax_booked' => 3]);
    $user = User::factory()->create();

    $reg = makeRegistration($pkg, $user, 3);

    expect(User::query()->whereKey($user->id)->exists())->toBeTrue();

    $this->actingAs($admin)
        ->delete(route('admin.b2c-packages.registrations.destroy', ['registration' => $reg->id]))
        ->assertRedirect();

    expect(B2cPackageRegistration::query()->whereKey($reg->id)->exists())->toBeFalse()
        ->and(User::query()->whereKey($user->id)->exists())->toBeTrue()
        ->and($pkg->fresh()->pax_booked)->toBe(0);
});

it('admin deletes all registrations for package when package code matches', function () {
    $admin = adminUserForDelete();
    $pkg = createAdminDeletePackage([
        'package_code' => 'CONFIRM-CODE-XYZ',
        'slug' => 'confirm-slug-xyz',
        'pax_booked' => 5,
    ]);
    $u1 = User::factory()->create();
    $u2 = User::factory()->create();
    makeRegistration($pkg, $u1, 2);
    makeRegistration($pkg, $u2, 3);

    $this->actingAs($admin)
        ->delete(route('admin.b2c-packages.registrations.destroy-all', ['b2cTravelPackage' => $pkg->slug]), [
            'confirm_package_code' => 'CONFIRM-CODE-XYZ',
        ])
        ->assertRedirect();

    expect(B2cPackageRegistration::query()->where('b2c_travel_package_id', $pkg->id)->count())->toBe(0)
        ->and($pkg->fresh()->pax_booked)->toBe(0)
        ->and(User::query()->whereIn('id', [$u1->id, $u2->id])->count())->toBe(2);
});

it('deleting a user cascades their b2c registrations and restores package pax_booked', function () {
    $pkg1 = createAdminDeletePackage([
        'pax_booked' => 2,
        'slug' => 'usr-del-a-'.uniqid(),
        'package_code' => 'USR-DEL-A-'.uniqid(),
    ]);
    $pkg2 = createAdminDeletePackage([
        'pax_booked' => 3,
        'slug' => 'usr-del-b-'.uniqid(),
        'package_code' => 'USR-DEL-B-'.uniqid(),
    ]);
    $user = User::factory()->create();
    makeRegistration($pkg1, $user, 2);
    makeRegistration($pkg2, $user, 3);

    $uid = $user->id;
    $user->delete();

    expect(B2cPackageRegistration::query()->where('user_id', $uid)->count())->toBe(0)
        ->and(B2cPackageRegistration::query()->count())->toBe(0)
        ->and(User::query()->whereKey($uid)->exists())->toBeFalse()
        ->and($pkg1->fresh()->pax_booked)->toBe(0)
        ->and($pkg2->fresh()->pax_booked)->toBe(0);
});

it('admin cannot bulk delete when package code mismatch', function () {
    $admin = adminUserForDelete();
    $pkg = createAdminDeletePackage([
        'package_code' => 'RIGHT-CODE',
        'slug' => 'bulk-reject-slug',
        'pax_booked' => 1,
    ]);
    $user = User::factory()->create();
    makeRegistration($pkg, $user, 1);

    $this->actingAs($admin)
        ->from(route('admin.b2c-packages.registrations', ['b2cTravelPackage' => $pkg->slug]))
        ->delete(route('admin.b2c-packages.registrations.destroy-all', ['b2cTravelPackage' => $pkg->slug]), [
            'confirm_package_code' => 'WRONG-CODE',
        ])
        ->assertSessionHasErrors('confirm_package_code');

    expect(B2cPackageRegistration::query()->where('b2c_travel_package_id', $pkg->id)->count())->toBe(1)
        ->and($pkg->fresh()->pax_booked)->toBe(1);
});
