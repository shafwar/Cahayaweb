<?php

use App\Notifications\AdminContactMessageNotification;
use App\Services\InboundLeadNotifier;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Notification;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('accepts valid contact form and notifies admins', function () {
    Notification::fake();

    Config::set('app.admin_emails', ['ops-contact-test-'.uniqid().'@test.local']);

    $this->from(route('b2c.contact'))
        ->post(route('b2c.contact.submit'), [
            'name' => 'Contoh Pengunjung',
            'email' => 'visitor-contact-'.uniqid().'@test.local',
            'phone' => '081234567890',
            'message' => 'Ini adalah pesan uji formulir kontak dengan panjang yang wajar untuk pengujian.',
        ])
        ->assertRedirect(route('b2c.contact'));

    Notification::assertSentOnDemand(AdminContactMessageNotification::class, function (AdminContactMessageNotification $n): bool {
        return str_contains($n->body, 'uji formulir kontak');
    });
});

it('dedupes merged admin_notify_emails and admin_emails', function () {
    Config::set('app.admin_notify_emails', ['same@test.local']);
    Config::set('app.admin_emails', ['same@test.local', 'other@test.local']);

    expect(InboundLeadNotifier::adminRecipientEmails())->toHaveCount(2)
        ->and(InboundLeadNotifier::adminRecipientEmails())->toContain('same@test.local', 'other@test.local');
});
