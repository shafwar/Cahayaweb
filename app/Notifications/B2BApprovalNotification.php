<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class B2BApprovalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public User $admin,
        public ?string $reason = null
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
            ->subject('🎉 Your B2B Account Has Been Approved!')
            ->greeting("Hello {$user->name}!")
            ->line("Great news! Your B2B account for **{$companyName}** has been approved by our admin team.")
            ->line('You can now access all B2B features including:')
            ->bulletList([
                'Exclusive business travel packages',
                'Special corporate rates',
                'Bulk booking management',
                'Priority customer support',
                'Detailed reporting and analytics'
            ])
            ->action('Access Your B2B Dashboard', route('b2b.dashboard'))
            ->line('If you have any questions or need assistance, please don\'t hesitate to contact our support team.')
            ->line('Thank you for choosing Cahaya Anbiya Travel!')
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
            'type' => 'b2b_approval',
            'admin_id' => $this->admin->id,
            'admin_name' => $this->admin->name,
            'company_name' => $notifiable->b2bVerification?->company_name,
            'reason' => $this->reason,
            'approved_at' => now()->toISOString(),
        ];
    }
}
