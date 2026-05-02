<?php

use App\Models\AgentVerification;
use App\Models\B2cPackageRegistration;
use App\Models\B2cTravelPackage;
use App\Models\User;
use App\Notifications\B2bAgentVerificationReviewedNotification;
use App\Notifications\B2cPackageRegistrationReviewedNotification;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Notification;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function notificationAdmin(): User
{
    $admin = User::factory()->create(['email' => 'admin-notify-'.uniqid().'@test.local']);
    Config::set('app.admin_emails', [$admin->email]);

    return $admin;
}

function notificationOpenPackage(): B2cTravelPackage
{
    $code = 'NOTIFY-PKG-'.uniqid();

    return B2cTravelPackage::query()->create([
        'slug' => 'notify-pkg-'.uniqid(),
        'package_code' => $code,
        'name' => 'Notify Test Package',
        'departure_period' => 'Apr 2026',
        'description' => 'Test.',
        'location' => 'Test',
        'duration_label' => '9D8N',
        'package_type' => 'Religious',
        'price_display' => 'Rp 1',
        'pax_capacity' => 25,
        'pax_booked' => 1,
        'registration_deadline' => Carbon::parse('2026-12-31', config('app.timezone')),
        'terms_and_conditions' => 'T.',
        'status' => 'open',
        'sort_order' => 0,
    ]);
}

it('sends B2C approval notification on demand to participant email', function () {
    Notification::fake();

    $admin = notificationAdmin();
    $pkg = notificationOpenPackage();
    $participantUser = User::factory()->create(['email' => 'b2c-participant-'.uniqid().'@test.local']);

    $registration = B2cPackageRegistration::query()->create([
        'b2c_travel_package_id' => $pkg->id,
        'user_id' => $participantUser->id,
        'full_name' => 'Peserta Test',
        'email' => 'b2c-email-'.uniqid().'@test.local',
        'phone' => '081234567890',
        'passport_number' => 'X1234567',
        'address' => 'Jl. Test',
        'date_of_birth' => '1990-01-01',
        'gender' => 'male',
        'departure_period_snapshot' => $pkg->departure_period,
        'pax' => 1,
        'registration_status' => 'pending',
        'payment_status' => 'unpaid',
        'visa_status' => 'not_processed',
        'ticket_status' => 'not_booked',
        'hotel_status' => 'not_assigned',
        'terms_accepted_at' => now(),
    ]);

    $this->actingAs($admin)->post(route('admin.b2c-packages.registrations.approve', $registration))->assertRedirect();

    Notification::assertSentOnDemand(B2cPackageRegistrationReviewedNotification::class, fn ($n) => $n->approved === true && $n->packageName === $pkg->name);
});

it('sends B2B rejection notification to applicant user', function () {
    Notification::fake();

    $admin = notificationAdmin();
    $applicant = User::factory()->create([
        'name' => 'Agen Tester',
        'email' => 'b2b-applicant-'.uniqid().'@test.local',
    ]);

    $verification = AgentVerification::query()->create([
        'user_id' => $applicant->id,
        'company_name' => 'PT Notifikasi Test',
        'company_email' => 'company-'.uniqid().'@test.local',
        'company_phone' => '021000000',
        'company_address' => 'Alamat kantor',
        'company_city' => 'Jakarta',
        'company_province' => 'DKI',
        'company_postal_code' => '12345',
        'company_country' => 'Indonesia',
        'business_type' => 'PT',
        'business_type_other' => null,
        'contact_person_name' => 'Contact',
        'contact_person_position' => 'Owner',
        'contact_person_phone' => '081111111111',
        'contact_person_email' => $applicant->email,
        'status' => 'pending',
        'admin_notes' => null,
        'reviewed_by' => null,
        'reviewed_at' => null,
        'resubmission_count' => 0,
        'last_resubmitted_at' => null,
    ]);

    $notes = 'Dokumen tidak lengkap untuk keperluan pengujian sistem notifikasi email.';

    $this->actingAs($admin)->post(route('admin.agent-verification.reject', $verification), [
        'admin_notes' => $notes,
    ])->assertRedirect();

    Notification::assertSentTo($applicant, B2bAgentVerificationReviewedNotification::class, fn ($n) => $n->approved === false && str_contains((string) $n->adminNotes, 'pengujian'));
});
