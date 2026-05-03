<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('login shows friendly message when email is not registered', function () {
    $this->post('/login', [
        'email' => 'tidak-ada-'.uniqid('', true).'@example.com',
        'password' => 'some-password',
    ])->assertSessionHasErrors(['email']);

    $errors = session('errors');
    expect($errors)->not->toBeNull();
    expect($errors->get('email')[0])->toContain('belum terdaftar');
});

test('login shows friendly message when password is wrong', function () {
    $email = 'ada-'.uniqid('', true).'@example.com';
    User::factory()->create([
        'email' => $email,
        'password' => Hash::make('correct-password'),
    ]);

    $this->post('/login', [
        'email' => $email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors(['email']);

    $errors = session('errors');
    expect($errors->get('email')[0])->toContain('Password tidak sesuai');
});
