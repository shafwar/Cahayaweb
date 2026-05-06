<?php

use App\Http\Controllers\B2cRegistrationController;
use App\Models\B2cTravelPackage;
use App\Models\User;
use App\Notifications\B2bApplicationSubmittedNotification;
use App\Notifications\B2cRegistrationReceivedNotification;
use App\Services\B2cPackageRegistrationRegistrar;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

/**
 * @return array<string, mixed>
 */
function b2cPkgAttrsForEmailTest(): array
{
    return [
        'name' => 'Pkg Email',
        'departure_period' => 'Apr 2026',
        'description' => 'Test.',
        'location' => 'Makkah',
        'duration_label' => '9D8N',
        'package_type' => 'Religious',
        'price_display' => 'Rp 1',
        'pax_capacity' => 20,
        'pax_booked' => 0,
        'registration_deadline' => Carbon::parse('2030-01-01 00:00:00', config('app.timezone')),
        'terms_and_conditions' => 'T.',
        'status' => 'open',
        'sort_order' => 0,
    ];
}

it('sends B2C participant confirmation when finalize completes', function () {
    Notification::fake();

    $slug = 'pkg-email-'.uniqid();
    $pkg = B2cTravelPackage::query()->create(array_merge(b2cPkgAttrsForEmailTest(), [
        'slug' => $slug,
        'package_code' => 'EMAIL-'.uniqid(),
    ]));

    $user = User::factory()->create(['email' => 'finalize-user@test.local']);

    session([B2cRegistrationController::SESSION_PENDING_REGISTRATION => [
        'package_id' => $pkg->id,
        'participant' => [
            'full_name' => 'Peserta Test',
            'email' => 'finalize-user@test.local',
            'phone' => '081234567890',
            'passport_number' => 'A123',
            'address' => 'Jl. Contoh',
            'date_of_birth' => '1990-01-15',
            'gender' => 'male',
            'pax' => 1,
            'terms_accepted' => true,
        ],
        'created_at' => time(),
    ]]);

    $this->actingAs($user)
        ->get(route('b2c.packages.register.finalize', ['b2cTravelPackage' => $pkg->slug]))
        ->assertRedirect();

    Notification::assertSentOnDemand(B2cRegistrationReceivedNotification::class);
});

it('sends B2C participant confirmation for legacy register path with new account', function () {
    Notification::fake();

    $slug = 'pkg-legacy-'.uniqid();
    $pkg = B2cTravelPackage::query()->create(array_merge(b2cPkgAttrsForEmailTest(), [
        'slug' => $slug,
        'package_code' => 'LEG-'.uniqid(),
    ]));

    $registrar = app(B2cPackageRegistrationRegistrar::class);
    $registrar->register($pkg, [
        'full_name' => 'User Baru',
        'email' => 'baru-b2c-'.uniqid().'@test.local',
        'phone' => '081234567890',
        'passport_number' => 'B999',
        'address' => 'Alamat',
        'date_of_birth' => '1991-05-20',
        'gender' => 'female',
        'pax' => 1,
        'account_mode' => 'create',
        'account_password' => 'PasswordKuat123!',
        'account_password_confirmation' => 'PasswordKuat123!',
    ]);

    Notification::assertSentOnDemand(B2cRegistrationReceivedNotification::class);
});

it('sends B2B applicant confirmation when application is stored', function () {
    Notification::fake();

    $user = User::factory()->create([
        'email' => 'b2b-app-'.uniqid().'@test.local',
    ]);

    $this->actingAs($user);

    $pdf = \Illuminate\Http\UploadedFile::fake()->create('license.pdf', 100, 'application/pdf');
    $pdf2 = \Illuminate\Http\UploadedFile::fake()->create('tax.pdf', 100, 'application/pdf');
    $pdf3 = \Illuminate\Http\UploadedFile::fake()->create('profile.pdf', 100, 'application/pdf');

    $this->post(route('b2b.register.store'), [
        'company_name' => 'PT Contoh Travel',
        'company_email' => 'company@test.local',
        'company_phone' => '+62 81234567890',
        'company_address' => 'Jl. Kantor 1',
        'company_city' => 'Jakarta',
        'company_province' => 'DKI',
        'company_postal_code' => '12345',
        'company_country' => 'Indonesia',
        'business_type' => 'PT',
        'contact_person_name' => 'Budi',
        'contact_person_position' => 'Owner',
        'contact_person_phone' => '+62 81234567891',
        'contact_person_email' => 'budi@test.local',
        'business_license_file' => $pdf,
        'tax_certificate_file' => $pdf2,
        'company_profile_file' => $pdf3,
    ])->assertRedirect(route('b2b.pending'));

    Notification::assertSentTo($user, B2bApplicationSubmittedNotification::class);
});
