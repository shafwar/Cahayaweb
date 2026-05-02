<?php

namespace App\Notifications;

use App\Models\AgentVerification;
use App\Models\User;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminNewB2bAgentApplicationNotification extends Notification
{
    public function __construct(
        public AgentVerification $verification,
        public User $applicant,
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
        $subjectPrefix = $this->isResubmission ? 'Pengajuan ulang agen B2B' : 'Pengajuan agen B2B baru';
        $detailUrl = url(route('admin.agent-verification.show', ['verification' => $this->verification->id], false));

        return (new MailMessage)
            ->subject("[{$app}] {$subjectPrefix} — {$this->verification->company_name}")
            ->greeting('Tim admin,')
            ->line($this->isResubmission
                ? 'Ada pengajuan verifikasi agen B2B yang dikirim ulang setelah penolakan.'
                : 'Ada pengajuan verifikasi agen B2B baru.')
            ->line('**Perusahaan:** '.$this->verification->company_name)
            ->line('**Email perusahaan:** '.$this->verification->company_email)
            ->line('**Akun pemohon:** '.$this->applicant->email.' ('.$this->applicant->name.')')
            ->line('**Status:** '.$this->verification->status)
            ->action('Buka detail pengajuan', $detailUrl)
            ->line('Email ini dikirim otomatis saat formulir agen berhasil disimpan.');
    }
}
