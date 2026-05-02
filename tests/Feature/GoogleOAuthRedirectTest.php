<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns 404 when google oauth credentials are missing', function () {
    config([
        'services.google.client_id' => null,
        'services.google.client_secret' => null,
    ]);

    $this->get(route('auth.google.redirect'))->assertNotFound();
});

it('redirects toward google when oauth is configured', function () {
    config([
        'services.google.client_id' => 'test-google-client-id',
        'services.google.client_secret' => 'test-google-secret',
        'services.google.redirect' => 'http://localhost/auth/google/callback',
    ]);

    $response = $this->get(route('auth.google.redirect', [
        'mode' => 'b2c',
        'entry' => 'login',
    ]));

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('accounts.google.com');
});
