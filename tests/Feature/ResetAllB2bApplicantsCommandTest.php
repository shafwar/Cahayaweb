<?php

use App\Models\AgentVerification;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function makeVerificationPayload(int $userId): array
{
    return [
        'user_id' => $userId,
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
    ];
}

test('reset all applicants dry run does not delete', function () {
    $u1 = User::factory()->create(['email' => 'b2b-a@example.com']);
    $u2 = User::factory()->create(['email' => 'b2b-b@example.com']);
    AgentVerification::query()->create(makeVerificationPayload($u1->id));
    AgentVerification::query()->create(makeVerificationPayload($u2->id));

    $this->artisan('b2b:reset-all-applicants', ['--dry-run' => true])->assertSuccessful();

    expect(User::query()->whereIn('email', ['b2b-a@example.com', 'b2b-b@example.com'])->count())->toBe(2);
    expect(AgentVerification::query()->count())->toBe(2);
});

test('reset all applicants force purges applicants', function () {
    $u1 = User::factory()->create(['email' => 'b2b-a@example.com']);
    $u2 = User::factory()->create(['email' => 'b2b-b@example.com']);
    AgentVerification::query()->create(makeVerificationPayload($u1->id));
    AgentVerification::query()->create(makeVerificationPayload($u2->id));

    $this->artisan('b2b:reset-all-applicants', ['--force' => true])->assertSuccessful();

    expect(User::query()->whereIn('email', ['b2b-a@example.com', 'b2b-b@example.com'])->exists())->toBeFalse();
    expect(AgentVerification::query()->count())->toBe(0);
});
