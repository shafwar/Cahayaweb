<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNewAccountNotification extends Notification
{
    public function __construct(
        public string $recipientName,
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
        $loginUrl = url(route('login', [], false));

        return (new MailMessage)
            ->subject("Selamat datang di {$app}")
            ->greeting('Halo '.$this->recipientName.',')
            ->line('Akun Anda baru saja dibuat. Terima kasih telah bergabung dengan '.$app.'.')
            ->line('Anda dapat masuk dengan email dan sandi yang Anda daftarkan (atau tombol Google jika Anda menggunakannya), lalu melanjutkan pengajuan paket B2C atau pengajuan agen B2B sesuai kebutuhan.')
            ->action('Masuk ke akun', $loginUrl)
            ->line('Jika Anda tidak merasa mendaftar, abaikan email ini atau hubungi kami melalui halaman kontak.')
            ->salutation('Salam hormat,'."\n".$app);
    }
}
