<?php

use App\Models\AgentVerification;
use App\Models\User;
use App\Services\B2bApplicantPurgeService;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('purge applicant removes user and verification rows', function () {
    $user = User::factory()->create(['email' => 'applicant-purge-test@example.com']);
    AgentVerification::query()->create([
        'user_id' => $user->id,
        'company_name' => 'Test Co',
        'company_email' => 'co@example.com',
        'company_phone' => '081',
        'company_address' => 'Addr',
        'company_city' => 'City',
        'company_province' => 'Prov',
        'company_postal_code' => '12345',
        'company_country' => 'Indonesia',
        'business_type' => 'PT',
        'contact_person_name' => 'CP',
        'contact_person_position' => 'Dir',
        'contact_person_phone' => '082',
        'contact_person_email' => 'cp@example.com',
        'status' => 'pending',
    ]);

    app(B2bApplicantPurgeService::class)->purgeApplicantUser($user);

    expect(User::query()->where('email', 'applicant-purge-test@example.com')->exists())->toBeFalse();
    expect(AgentVerification::query()->where('user_id', $user->id)->exists())->toBeFalse();
});

test('reclaim email command removes orphan user by email', function () {
    $user = User::factory()->create(['email' => 'orphan-reclaim@example.com']);

    $this->artisan('b2b:reclaim-email', ['email' => $user->email, '--force' => true])
        ->assertSuccessful();

    expect(User::query()->where('email', 'orphan-reclaim@example.com')->exists())->toBeFalse();
});
