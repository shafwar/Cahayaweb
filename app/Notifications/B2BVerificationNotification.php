<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\B2BVerification;

class B2BVerificationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public B2BVerification $verification;

    /**
     * Create a new notification instance.
     */
    public function __construct(B2BVerification $verification)
    {
        $this->verification = $verification;
    }

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
        return (new MailMessage)
            ->subject('B2B Verification Required - Cahaya Anbiya')
            ->greeting("Hello {$notifiable->name}!")
            ->line("Thank you for your interest in becoming a B2B partner with Cahaya Anbiya.")
            ->line("We have received your business verification request and it is currently under review.")
            ->line("**Company Details:**")
            ->line("• Company: {$this->verification->company_name}")
            ->line("• Contact Person: {$this->verification->contact_person}")
            ->line("• Contact Email: {$this->verification->contact_email}")
            ->line("• Contact Phone: {$this->verification->contact_phone}")
            ->line("**Next Steps:**")
            ->line("1. Our team will review your application within 2-3 business days")
            ->line("2. You will receive an email notification once the review is complete")
            ->line("3. If approved, you'll gain access to our B2B portal and exclusive pricing")
            ->line("4. If additional information is needed, we'll contact you directly")
            ->line("**What Happens After Approval:**")
            ->line("• Access to exclusive B2B pricing and packages")
            ->line("• Ability to book travel packages for your clients")
            ->line("• Dedicated support team for business accounts")
            ->line("• Special promotions and early access to new packages")
            ->action('View Application Status', route('b2b.verification.status'))
            ->line("If you have any questions or need to update your application, please don't hesitate to contact us.")
            ->line("Thank you for choosing Cahaya Anbiya for your travel business needs!")
            ->salutation("Best regards,\nCahaya Anbiya Team");
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'verification_id' => $this->verification->id,
            'company_name' => $this->verification->company_name,
            'status' => $this->verification->status,
        ];
    }
}
