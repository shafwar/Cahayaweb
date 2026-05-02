<?php

namespace App\Services;

use App\Models\B2cPackageRegistration;
use App\Models\User;
use App\Notifications\B2bAgentVerificationReviewedNotification;
use App\Notifications\B2cPackageRegistrationReviewedNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class RegistrationReviewNotifier
{
    public static function notifyB2cParticipant(B2cPackageRegistration $registration, bool $approved, ?string $notes = null): void
    {
        $email = trim((string) $registration->email);
        if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            Log::warning('B2C review email skipped: invalid participant email', [
                'registration_id' => $registration->id,
            ]);

            return;
        }

        $registration->loadMissing('package');
        $packageName = $registration->package?->name ?? 'paket Anda';

        try {
            Notification::route('mail', $email)->notify(new B2cPackageRegistrationReviewedNotification(
                participantName: (string) $registration->full_name,
                packageName: $packageName,
                approved: $approved,
                notes: $notes,
            ));
        } catch (\Throwable $e) {
            Log::error('B2C review email failed', [
                'registration_id' => $registration->id,
                'email' => $email,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public static function notifyB2bApplicant(User $user, string $companyName, bool $approved, ?string $adminNotes = null): void
    {
        $email = trim((string) $user->email);
        if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            Log::warning('B2B review email skipped: invalid user email', [
                'user_id' => $user->id,
            ]);

            return;
        }

        $name = (string) ($user->name ?: $email);

        try {
            $user->notify(new B2bAgentVerificationReviewedNotification(
                recipientName: $name,
                companyName: $companyName,
                approved: $approved,
                adminNotes: $adminNotes,
            ));
        } catch (\Throwable $e) {
            Log::error('B2B review email failed', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
