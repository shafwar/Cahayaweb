<?php

use App\Models\User;
use Illuminate\Support\Facades\Config;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('purge except admins dry run lists users', function () {
    Config::set('app.admin_emails', ['boss@example.com']);
    User::factory()->create(['email' => 'boss@example.com']);
    User::factory()->create(['email' => 'user@example.com']);

    $this->artisan('users:purge-except-admins', ['--dry-run' => true])
        ->assertSuccessful();
});

test('purge except admins removes only non admins', function () {
    Config::set('app.admin_emails', ['boss@example.com']);
    User::factory()->create(['email' => 'boss@example.com']);
    User::factory()->create(['email' => 'user@example.com']);

    $this->artisan('users:purge-except-admins', ['--force' => true])
        ->assertSuccessful();

    expect(User::query()->count())->toBe(1);
    expect(User::query()->where('email', 'boss@example.com')->exists())->toBeTrue();
    expect(User::query()->where('email', 'user@example.com')->exists())->toBeFalse();
});

test('purge except admins refuses when nothing would be kept', function () {
    Config::set('app.admin_emails', []);
    User::factory()->create(['email' => 'only@example.com']);

    $this->artisan('users:purge-except-admins', ['--force' => true])
        ->assertFailed();
});
