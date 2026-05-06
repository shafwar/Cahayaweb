<?php

namespace App\Notifications;

use App\Models\B2cPackageRegistration;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class B2cRegistrationReceivedNotification extends Notification
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
        $pkg = $this->registration->package?->name ?? 'paket Anda';
        $accountUrl = url(route('b2c.account', [], false));

        return (new MailMessage)
            ->subject("[{$app}] Konfirmasi: Pengajuan paket kami terima — {$pkg}")
            ->greeting('Halo '.$this->registration->full_name.',')
            ->line('Terima kasih. Pengajuan pendaftaran paket wisata Anda telah kami terima dan akan ditinjau oleh tim kami.')
            ->line('**Paket:** '.$pkg)
            ->line('**Jumlah pax:** '.(string) $this->registration->pax)
            ->line('Status saat ini: **menunggu peninjauan**. Anda akan menerima email lagi setelah admin memproses pengajuan.')
            ->action('Lihat status di akun saya', $accountUrl)
            ->line('Jika Anda tidak mengirim pengajuan ini, abaikan email ini atau hubungi kami melalui halaman kontak.')
            ->salutation('Salam hormat,'."\n".$app);
    }
}
