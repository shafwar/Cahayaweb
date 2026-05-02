<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Sent when an admin approves or rejects a B2C package registration (participant email).
 *
 * Dispatched synchronously so mail sends without a queue worker (production uses database queue by default).
 */
class B2cPackageRegistrationReviewedNotification extends Notification
{
    public function __construct(
        public string $participantName,
        public string $packageName,
        public bool $approved,
        public ?string $notes = null,
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
        $accountUrl = url(route('b2c.account', [], false));

        if ($this->approved) {
            return (new MailMessage)
                ->subject("Pengajuan paket disetujui — {$app}")
                ->greeting("Halo {$this->participantName},")
                ->line("Pengajuan Anda untuk paket **{$this->packageName}** telah **disetujui**.")
                ->line('Silakan masuk ke akun B2C Anda untuk melihat detail dan langkah selanjutnya.')
                ->action('Buka akun B2C', $accountUrl)
                ->line('Jika Anda tidak mengharapkan email ini, abaikan pesan ini.')
                ->salutation('Salam hormat,'."\n".$app);
        }

        $mail = (new MailMessage)
            ->subject("Pengajuan paket tidak disetujui — {$app}")
            ->greeting("Halo {$this->participantName},")
            ->line("Maaf, pengajuan Anda untuk paket **{$this->packageName}** **tidak disetujui** saat ini.");

        if ($this->notes !== null && $this->notes !== '') {
            $mail->line('Catatan dari tim kami:')
                ->line($this->notes);
        }

        return $mail
            ->line('Anda dapat masuk ke akun B2C untuk informasi lebih lanjut atau menghubungi kami melalui halaman kontak website.')
            ->action('Buka akun B2C', $accountUrl)
            ->salutation('Salam hormat,'."\n".$app);
    }
}
