<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminContactMessageNotification extends Notification
{
    public function __construct(
        public string $senderName,
        public string $senderEmail,
        public string $senderPhone,
        public string $body,
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

        return (new MailMessage)
            ->subject("[{$app}] Pesan kontak dari {$this->senderName}")
            ->replyTo($this->senderEmail, $this->senderName)
            ->greeting('Tim admin,')
            ->line('Seseorang mengirim pesan dari halaman Kontak website.')
            ->line('**Nama:** '.$this->senderName)
            ->line('**Email:** '.$this->senderEmail)
            ->line('**Telepon:** '.$this->senderPhone)
            ->line('**Pesan:**')
            ->line($this->body);
    }
}
