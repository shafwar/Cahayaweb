<?php

namespace App\Notifications;

use App\Models\B2cPackageRegistration;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminNewB2cRegistrationNotification extends Notification
{
    public function __construct(
        public B2cPackageRegistration $registration,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $app = config('app.name', 'Cahaya Anbiya');
        $this->registration->loadMissing('package');
        $pkg = $this->registration->package?->name ?? '(paket)';
        $slug = $this->registration->package?->slug;
        $adminUrl = $slug !== null && $slug !== ''
            ? url(route('admin.b2c-packages.registrations', ['b2cTravelPackage' => $slug], false))
            : url(route('admin.b2c-packages.index', [], false));

        return (new MailMessage)
            ->subject("[{$app}] Pendaftaran paket B2C baru — {$pkg}")
            ->greeting('Tim admin,')
            ->line('Ada pengajuan paket wisata B2C baru yang menunggu review.')
            ->line('**Paket:** '.$pkg)
            ->line('**Nama peserta:** '.$this->registration->full_name)
            ->line('**Email:** '.$this->registration->email)
            ->line('**Telepon:** '.$this->registration->phone)
            ->line('**Pax:** '.(string) $this->registration->pax)
            ->action('Buka daftar peserta paket', $adminUrl)
            ->line('Email ini dikirim otomatis ketika formulir registrasi paket berhasil dikirim.');
    }
}
