<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class B2BRejectionNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public User $admin,
        public string $reason
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $user = $notifiable;
        $companyName = $user->b2bVerification?->company_name ?? $user->name;

        return (new MailMessage)
            ->subject('📋 B2B Account Application Update')
            ->greeting("Hello {$user->name}!")
            ->line("We have reviewed your B2B account application for **{$companyName}**.")
            ->line('Unfortunately, we are unable to approve your application at this time.')
            ->line('**Reason for rejection:**')
            ->line($this->reason)
            ->line('**What you can do next:**')
            ->bulletList([
                'Review the reason provided above',
                'Update your application with the required information',
                'Re-upload any missing or incorrect documents',
                'Resubmit your application for review'
            ])
            ->action('Update Your Application', route('b2b.dashboard'))
            ->line('If you believe this decision was made in error or have additional information to provide, please contact our support team.')
            ->line('We appreciate your interest in partnering with Cahaya Anbiya Travel.')
            ->salutation('Best regards, The Cahaya Anbiya Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'b2b_rejection',
            'admin_id' => $this->admin->id,
            'admin_name' => $this->admin->name,
            'company_name' => $notifiable->b2bVerification?->company_name,
            'reason' => $this->reason,
            'rejected_at' => now()->toISOString(),
        ];
    }
}
