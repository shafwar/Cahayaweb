<?php

use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function participantAdmin(): User
{
    $admin = User::factory()->create(['email' => 'admin-participant-'.uniqid().'@test.local']);
    Config::set('app.admin_emails', [$admin->email]);

    return $admin;
}

function participantTestPackage(): B2cTravelPackage
{
    return B2cTravelPackage::query()->create([
        'slug' => 'pt-'.uniqid(),
        'package_code' => 'PT-'.uniqid(),
        'name' => 'Participant test package',
        'departure_period' => 'Jun 2026',
        'description' => 'Test.',
        'location' => 'Makkah',
        'duration_label' => '9D8N',
        'package_type' => 'Religious',
        'price_display' => 'Rp 1',
        'pax_capacity' => 20,
        'pax_booked' => 1,
        'registration_deadline' => Carbon::parse('2026-06-01', config('app.timezone')),
        'terms_and_conditions' => 'T.',
        'status' => 'open',
        'sort_order' => 0,
    ]);
}

it('guest cannot open participant detail', function () {
    $pkg = participantTestPackage();
    $reg = B2cPackageRegistration::query()->create([
        'b2c_travel_package_id' => $pkg->id,
        'user_id' => null,
        'full_name' => 'Guest P',
        'email' => 'guest-p@test.local',
        'phone' => '081',
        'passport_number' => 'X1',
        'address' => 'Addr',
        'date_of_birth' => '1990-01-01',
        'gender' => 'male',
        'departure_period_snapshot' => $pkg->departure_period,
        'pax' => 1,
        'terms_accepted_at' => now(),
    ]);

    $this->get('/admin/participants/'.$reg->id)->assertRedirect();
});

it('admin can update lifecycle fields and data persists', function () {
    $admin = participantAdmin();
    $pkg = participantTestPackage();
    $user = User::factory()->create();

    $reg = B2cPackageRegistration::query()->create([
        'b2c_travel_package_id' => $pkg->id,
        'user_id' => $user->id,
        'full_name' => 'Lifecycle P',
        'email' => $user->email,
        'phone' => '082',
        'passport_number' => 'X2',
        'address' => 'Addr 2',
        'date_of_birth' => '1991-02-02',
        'gender' => 'female',
        'departure_period_snapshot' => $pkg->departure_period,
        'pax' => 1,
        'registration_status' => 'pending',
        'payment_status' => 'unpaid',
        'visa_status' => 'not_processed',
        'ticket_status' => 'not_booked',
        'hotel_status' => 'not_assigned',
        'notes' => null,
        'terms_accepted_at' => now(),
    ]);

    $this->actingAs($admin)
        ->put('/admin/participants/'.$reg->id, [
            'registration_status' => 'approved',
            'payment_status' => 'paid',
            'visa_status' => 'completed',
            'ticket_status' => 'booked',
            'hotel_status' => 'assigned',
            'notes' => 'Visa selesai, tiket issued.',
        ])
        ->assertRedirect();

    $reg->refresh();

    expect($reg->registration_status)->toBe('approved')
        ->and($reg->payment_status)->toBe('paid')
        ->and($reg->visa_status)->toBe('completed')
        ->and($reg->ticket_status)->toBe('booked')
        ->and($reg->hotel_status)->toBe('assigned')
        ->and($reg->notes)->toBe('Visa selesai, tiket issued.')
        ->and($reg->reviewed_by)->toBe($admin->id)
        ->and($reg->reviewed_at)->not->toBeNull();
});

it('admin can change only payment without touching reviewed_at when registration status unchanged', function () {
    $admin = participantAdmin();
    $pkg = participantTestPackage();
    $user = User::factory()->create();

    $reg = B2cPackageRegistration::query()->create([
        'b2c_travel_package_id' => $pkg->id,
        'user_id' => $user->id,
        'full_name' => 'Pay Only',
        'email' => $user->email,
        'phone' => '083',
        'passport_number' => 'X3',
        'address' => 'Addr 3',
        'date_of_birth' => '1992-03-03',
        'gender' => 'male',
        'departure_period_snapshot' => $pkg->departure_period,
        'pax' => 1,
        'registration_status' => 'approved',
        'payment_status' => 'unpaid',
        'visa_status' => 'not_processed',
        'ticket_status' => 'not_booked',
        'hotel_status' => 'not_assigned',
        'notes' => null,
        'reviewed_by' => $admin->id,
        'reviewed_at' => now()->subHour(),
        'terms_accepted_at' => now(),
    ]);

    $reviewedAtBefore = $reg->fresh()->reviewed_at?->toIso8601String();

    $this->actingAs($admin)
        ->put('/admin/participants/'.$reg->id, [
            'registration_status' => 'approved',
            'payment_status' => 'waiting_confirmation',
            'visa_status' => 'in_progress',
            'ticket_status' => 'not_booked',
            'hotel_status' => 'not_assigned',
            'notes' => 'Menunggu bukti transfer.',
        ])
        ->assertRedirect();

    $reg->refresh();

    expect($reg->payment_status)->toBe('waiting_confirmation')
        ->and($reg->fresh()->reviewed_at?->toIso8601String())->toBe($reviewedAtBefore);
});
