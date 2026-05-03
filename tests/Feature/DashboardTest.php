<?php

use App\Models\User;
use Illuminate\Support\Facades\Config;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users are redirected from dashboard to home', function () {
    $this->actingAs(User::factory()->create());

    $this->get('/dashboard')->assertRedirect(route('home'));
});

test('admin users are redirected from dashboard to admin entry', function () {
    $email = 'dashboard-admin-'.uniqid('', true).'@test.local';
    Config::set('app.admin_emails', [$email]);

    $this->actingAs(User::factory()->create(['email' => $email]));

    $this->get('/dashboard')->assertRedirect(route('admin.dashboard'));
});
