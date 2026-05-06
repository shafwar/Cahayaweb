<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class B2bApplicationSubmittedNotification extends Notification
{
    public function __construct(
        public string $recipientName,
        public string $companyName,
        public bool $isResubmission,
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
        $pendingUrl = url(route('b2b.pending', [], false));
        $subject = $this->isResubmission
            ? "[{$app}] Pengajuan agen diperbarui — {$this->companyName}"
            : "[{$app}] Konfirmasi: Pengajuan agen kami terima — {$this->companyName}";

        $mail = (new MailMessage)
            ->subject($subject)
            ->greeting('Halo '.$this->recipientName.',')
            ->line(
                $this->isResubmission
                    ? 'Kami telah menerima pembaruan pengajuan keagenan Anda dan akan ditinjau oleh tim.'
                    : 'Terima kasih. Pengajuan keagenan B2B Anda telah kami terima dan akan ditinjau oleh tim.'
            )
            ->line('**Nama perusahaan / badan usaha:** '.$this->companyName)
            ->line('Status: **menunggu peninjauan**. Anda akan menerima email lagi setelah admin memutuskan.')
            ->action('Status pengajuan', $pendingUrl)
            ->line('Jika Anda tidak mengirim pengajuan ini, abaikan email ini atau hubungi kami melalui halaman kontak.')
            ->salutation('Salam hormat,'."\n".$app);

        return $mail;
    }
}
