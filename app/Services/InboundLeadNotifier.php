<?php

namespace App\Services;

use App\Models\AgentVerification;
use App\Models\B2cPackageRegistration;
use App\Models\User;
use App\Notifications\AdminContactMessageNotification;
use App\Notifications\AdminNewB2bAgentApplicationNotification;
use App\Notifications\AdminNewB2cRegistrationNotification;
use App\Notifications\WelcomeNewAccountNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class InboundLeadNotifier
{
    /**
     * @return list<string>
     */
    public static function adminRecipientEmails(): array
    {
        $notify = config('app.admin_notify_emails', []);
        $admins = config('app.admin_emails', []);
        $raw = [];
        if (is_array($notify)) {
            $raw = array_merge($raw, $notify);
        }
        if (is_array($admins)) {
            $raw = array_merge($raw, $admins);
        }

        $out = [];
        foreach ($raw as $email) {
            $email = trim((string) $email);
            if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $out[strtolower($email)] = $email;
            }
        }

        return array_values($out);
    }

    public static function notifyAdminsB2cRegistration(B2cPackageRegistration $registration): void
    {
        $registration->loadMissing('package');
        foreach (self::adminRecipientEmailsOrLog() as $email) {
            try {
                Notification::route('mail', $email)->notify(new AdminNewB2cRegistrationNotification($registration));
            } catch (\Throwable $e) {
                Log::error('Admin B2C registration alert failed', [
                    'registration_id' => $registration->id,
                    'admin_email' => $email,
                    'message' => $e->getMessage(),
                ]);
            }
        }
    }

    public static function notifyAdminsB2bApplication(AgentVerification $verification, User $applicant, bool $isResubmission): void
    {
        foreach (self::adminRecipientEmailsOrLog() as $email) {
            try {
                Notification::route('mail', $email)->notify(new AdminNewB2bAgentApplicationNotification($verification, $applicant, $isResubmission));
            } catch (\Throwable $e) {
                Log::error('Admin B2B application alert failed', [
                    'verification_id' => $verification->id,
                    'admin_email' => $email,
                    'message' => $e->getMessage(),
                ]);
            }
        }
    }

    public static function notifyAdminsContact(string $name, string $email, string $phone, string $message): void
    {
        foreach (self::adminRecipientEmailsOrLog() as $adminEmail) {
            try {
                Notification::route('mail', $adminEmail)->notify(new AdminContactMessageNotification($name, $email, $phone, $message));
            } catch (\Throwable $e) {
                Log::error('Admin contact form alert failed', [
                    'admin_email' => $adminEmail,
                    'message' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * @return list<string>
     */
    private static function adminRecipientEmailsOrLog(): array
    {
        $emails = self::adminRecipientEmails();
        if ($emails === []) {
            Log::warning('InboundLeadNotifier: APP_ADMIN_EMAILS kosong — email admin tidak dikirim.');
        }

        return $emails;
    }

    public static function notifyUserWelcome(User $user): void
    {
        $email = trim((string) $user->email);
        if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return;
        }

        try {
            $user->notify(new WelcomeNewAccountNotification((string) ($user->name ?: $email)));
        } catch (\Throwable $e) {
            Log::error('Welcome email failed', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
