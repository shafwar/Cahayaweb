<?php

namespace App\Services;

use App\Models\AgentVerification;
use App\Models\B2cPackageRegistration;
use App\Models\User;
use App\Notifications\AdminContactMessageNotification;
use App\Notifications\AdminNewB2bAgentApplicationNotification;
use App\Notifications\AdminNewB2cRegistrationNotification;
use App\Notifications\B2bApplicationSubmittedNotification;
use App\Notifications\B2cRegistrationReceivedNotification;
use App\Notifications\WelcomeNewAccountNotification;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification as NotificationFacade;

class InboundLeadNotifier
{
    /**
     * Inboxes for contact + B2B/B2C admin alerts (deduped, validated).
     *
     * @return list<string>
     */
    public static function adminRecipientEmails(): array
    {
        $notify = config('app.admin_notify_emails', []);
        $admins = config('app.admin_emails', []);
        $ops = trim((string) config('app.mail_ops_notify_email', ''));

        $raw = [];
        if (is_array($notify)) {
            $raw = array_merge($raw, $notify);
        }
        if (is_array($admins)) {
            $raw = array_merge($raw, $admins);
        }
        if ($ops !== '' && filter_var($ops, FILTER_VALIDATE_EMAIL)) {
            $raw[] = $ops;
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

    /**
     * True when mail is configured to leave the app (not only log/array), or override is on.
     */
    public static function outboundMailSendsToNetwork(): bool
    {
        if (config('app.allow_log_mailer_for_admin_alerts', false)) {
            return true;
        }

        $mailer = (string) config('mail.default', 'log');

        return ! in_array($mailer, ['log', 'array'], true);
    }

    /**
     * User-facing reason when contact mail cannot be sent due to server mail config.
     */
    public static function contactFormMailConfigError(): ?string
    {
        if (self::adminRecipientEmails() === []) {
            return 'Pesan belum dapat dikirim ke tim email: atur ADMIN_NOTIFY_EMAILS, APP_ADMIN_EMAILS, atau MAIL_OPS_NOTIFY_EMAIL di server (inbox Gmail operasional).';
        }

        if (app()->environment('production') && ! self::outboundMailSendsToNetwork()) {
            return 'Email keluar belum diaktifkan di server: set MAIL_MAILER=resend (atau smtp) dan kunci/API yang sesuai. Saat ini MAIL_MAILER masih log/array sehingga pesan tidak sampai ke Gmail.';
        }

        if (config('mail.default') === 'resend' && ! (bool) config('services.resend.key')) {
            return 'MAIL_MAILER=resend tetapi RESEND_KEY / RESEND_API_KEY belum diisi di server.';
        }

        return null;
    }

    /**
     * Human-readable lines for deploy checks (e.g. verify-railway-env.php).
     *
     * @return list<string>
     */
    public static function diagnosticIssues(): array
    {
        $issues = [];

        if (self::adminRecipientEmails() === []) {
            $issues[] = 'Admin alert recipients empty — set ADMIN_NOTIFY_EMAILS and/or MAIL_OPS_NOTIFY_EMAIL (comma list or single ops Gmail).';
        }

        if (app()->environment('production') && ! self::outboundMailSendsToNetwork()) {
            $issues[] = 'Production uses MAIL_MAILER=log or array — no real email leaves the server.';
        }

        if (config('mail.default') === 'resend' && ! (bool) config('services.resend.key')) {
            $issues[] = 'Resend mailer selected but services.resend.key is empty — set RESEND_KEY or RESEND_API_KEY.';
        }

        $from = trim((string) config('mail.from.address', ''));
        if ($from === '' || ! filter_var($from, FILTER_VALIDATE_EMAIL)) {
            $issues[] = 'MAIL_FROM_ADDRESS is missing or invalid — Resend/SMTP often reject or fail.';
        }

        return $issues;
    }

    /**
     * @return array{sent: int, errors: list<string>}
     */
    public static function notifyAdminsB2cRegistration(B2cPackageRegistration $registration): array
    {
        $registration->loadMissing('package');

        return self::notifyEachAdmin(
            new AdminNewB2cRegistrationNotification($registration),
            'b2c_registration',
            ['registration_id' => $registration->id]
        );
    }

    /**
     * @return array{sent: int, errors: list<string>}
     */
    public static function notifyAdminsB2bApplication(AgentVerification $verification, User $applicant, bool $isResubmission): array
    {
        return self::notifyEachAdmin(
            new AdminNewB2bAgentApplicationNotification($verification, $applicant, $isResubmission),
            'b2b_application',
            ['verification_id' => $verification->id]
        );
    }

    /**
     * @return array{sent: int, errors: list<string>}
     */
    public static function notifyAdminsContact(string $name, string $email, string $phone, string $message): array
    {
        return self::notifyEachAdmin(
            new AdminContactMessageNotification($name, $email, $phone, $message),
            'contact',
            []
        );
    }

    /**
     * @param  array<string, mixed>  $logContext
     * @return array{sent: int, errors: list<string>}
     */
    private static function notifyEachAdmin(Notification $notification, string $context, array $logContext): array
    {
        $emails = self::adminRecipientEmails();
        if ($emails === []) {
            Log::warning('InboundLeadNotifier: no admin recipients — alert not sent.', array_merge(['context' => $context], $logContext));

            return ['sent' => 0, 'errors' => ['no_recipients']];
        }

        if (app()->environment('production') && ! self::outboundMailSendsToNetwork()) {
            Log::critical('InboundLeadNotifier: production mailer is log/array — admin alert skipped.', array_merge(['context' => $context], $logContext));

            return ['sent' => 0, 'errors' => ['mailer_does_not_send']];
        }

        $sent = 0;
        $errors = [];
        foreach ($emails as $adminEmail) {
            try {
                NotificationFacade::route('mail', $adminEmail)->notify($notification);
                $sent++;
                Log::info('InboundLeadNotifier: admin notification sent.', array_merge([
                    'context' => $context,
                    'to' => $adminEmail,
                ], $logContext));
            } catch (\Throwable $e) {
                $msg = $e->getMessage();
                $errors[] = $adminEmail.': '.$msg;
                Log::error('InboundLeadNotifier: admin notification failed.', array_merge([
                    'context' => $context,
                    'admin_email' => $adminEmail,
                    'message' => $msg,
                ], $logContext));
            }
        }

        if ($sent === 0 && $errors !== []) {
            Log::critical('InboundLeadNotifier: all admin recipients failed.', array_merge([
                'context' => $context,
                'errors' => $errors,
            ], $logContext));
        }

        return ['sent' => $sent, 'errors' => $errors];
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

    /**
     * Participant confirmation after B2C package registration is saved (same moment as admin alert).
     *
     * @return array{sent: int, errors: list<string>}
     */
    public static function notifyUserB2cRegistrationReceived(B2cPackageRegistration $registration): array
    {
        $registration->loadMissing('package');
        $email = trim((string) $registration->email);
        if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            Log::warning('InboundLeadNotifier: B2C user confirmation skipped (invalid email).', [
                'registration_id' => $registration->id,
            ]);

            return ['sent' => 0, 'errors' => ['invalid_email']];
        }

        $reg = $registration;

        return self::notifyUserEmailWithRetries(
            static function () use ($reg, $email): void {
                NotificationFacade::route('mail', $email)->notify(new B2cRegistrationReceivedNotification($reg));
            },
            'b2c_user_registration_received',
            ['registration_id' => $registration->id, 'to' => $email]
        );
    }

    /**
     * Applicant confirmation after B2B application is saved (alongside admin alert).
     *
     * @return array{sent: int, errors: list<string>}
     */
    public static function notifyUserB2bApplicationSubmitted(User $user, string $companyName, bool $isResubmission): array
    {
        $email = trim((string) $user->email);
        if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            Log::warning('InboundLeadNotifier: B2B user confirmation skipped (invalid email).', [
                'user_id' => $user->id,
            ]);

            return ['sent' => 0, 'errors' => ['invalid_email']];
        }

        $name = (string) ($user->name ?: $email);
        $company = trim($companyName) !== '' ? trim($companyName) : 'perusahaan Anda';

        return self::notifyUserEmailWithRetries(
            static function () use ($user, $name, $company, $isResubmission): void {
                $user->notify(new B2bApplicationSubmittedNotification($name, $company, $isResubmission));
            },
            'b2b_user_application_submitted',
            ['user_id' => $user->id, 'to' => $email]
        );
    }

    /**
     * @param  callable():void  $send
     * @param  array<string, mixed>  $logContext
     * @return array{sent: int, errors: list<string>}
     */
    private static function notifyUserEmailWithRetries(callable $send, string $context, array $logContext): array
    {
        if (app()->environment('production') && ! self::outboundMailSendsToNetwork()) {
            Log::critical('InboundLeadNotifier: user email skipped — production mailer is log/array.', array_merge(['context' => $context], $logContext));

            return ['sent' => 0, 'errors' => ['mailer_does_not_send']];
        }

        $last = '';
        for ($attempt = 0; $attempt < 3; $attempt++) {
            try {
                $send();
                Log::info('InboundLeadNotifier: user email sent.', array_merge(['context' => $context, 'attempt' => $attempt + 1], $logContext));

                return ['sent' => 1, 'errors' => []];
            } catch (\Throwable $e) {
                $last = $e->getMessage();
                Log::warning('InboundLeadNotifier: user email attempt failed.', array_merge([
                    'context' => $context,
                    'attempt' => $attempt + 1,
                    'message' => $last,
                ], $logContext));
                if ($attempt < 2) {
                    usleep(150000 * ($attempt + 1));
                }
            }
        }

        Log::critical('InboundLeadNotifier: user email failed after retries.', array_merge([
            'context' => $context,
            'message' => $last,
        ], $logContext));

        return ['sent' => 0, 'errors' => [$last !== '' ? $last : 'send_failed']];
    }
}
