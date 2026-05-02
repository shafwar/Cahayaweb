<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Sent when an admin approves or rejects a B2B agent verification application.
 */
class B2bAgentVerificationReviewedNotification extends Notification
{
    public function __construct(
        public string $recipientName,
        public string $companyName,
        public bool $approved,
        public ?string $adminNotes = null,
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
        $portalUrl = url(route('b2b.index', [], false));

        if ($this->approved) {
            return (new MailMessage)
                ->subject("Pengajuan agen B2B disetujui — {$app}")
                ->greeting("Halo {$this->recipientName},")
                ->line("Pengajuan agen B2B untuk **{$this->companyName}** telah **disetujui**.")
                ->line('Anda dapat masuk ke portal B2B untuk melanjutkan aktivitas.')
                ->action('Buka portal B2B', $portalUrl)
                ->salutation('Salam hormat,'."\n".$app);
        }

        $mail = (new MailMessage)
            ->subject("Pengajuan agen B2B tidak disetujui — {$app}")
            ->greeting("Halo {$this->recipientName},")
            ->line("Maaf, pengajuan agen B2B untuk **{$this->companyName}** **tidak disetujui** saat ini.");

        if ($this->adminNotes !== null && $this->adminNotes !== '') {
            $mail->line('Alasan / catatan dari tim kami:')
                ->line($this->adminNotes);
        }

        return $mail
            ->line('Anda dapat memperbaiki dokumen dan mengajukan ulang melalui portal jika diperbolehkan, atau menghubungi kami melalui kontak website.')
            ->action('Buka portal B2B', $portalUrl)
            ->salutation('Salam hormat,'."\n".$app);
    }
}
