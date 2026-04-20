<?php

namespace App\Services;

use App\Models\AgentVerification;
use App\Models\User;
use App\Support\AgentVerificationFileCleanup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Hard-removes a B2B applicant user and related traces so the email can register again.
 * R2/public files: purged for every agent_verifications row for this user before the user row is deleted.
 */
class B2bApplicantPurgeService
{
    public function isPrivilegedAdmin(User $user): bool
    {
        if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
            return true;
        }

        return in_array($user->email, config('app.admin_emails', []), true);
    }

    /**
     * @throws \InvalidArgumentException if the account is a privileged admin user
     */
    public function purgeApplicantUser(User $user): void
    {
        if ($this->isPrivilegedAdmin($user)) {
            throw new \InvalidArgumentException('Refusing to purge a privileged administrator account.');
        }

        $userId = (int) $user->id;
        $email = Str::lower((string) $user->email);

        DB::transaction(function () use ($userId, $email) {
            $locked = User::query()->whereKey($userId)->lockForUpdate()->first();
            if ($locked === null) {
                return;
            }

            foreach (AgentVerification::query()->where('user_id', $userId)->cursor() as $verification) {
                AgentVerificationFileCleanup::purgeStorageFor($verification);
            }

            if (Schema::hasTable('password_reset_tokens')) {
                DB::table('password_reset_tokens')->whereRaw('LOWER(email) = ?', [$email])->delete();
            }

            if (Schema::hasTable('sessions')) {
                DB::table('sessions')->where('user_id', $userId)->delete();
            }

            if (Schema::hasTable('personal_access_tokens')) {
                DB::table('personal_access_tokens')
                    ->where('tokenable_id', $userId)
                    ->where('tokenable_type', User::class)
                    ->delete();
            }

            if (Schema::hasTable('notifications')) {
                DB::table('notifications')
                    ->where('notifiable_id', $userId)
                    ->where('notifiable_type', User::class)
                    ->delete();
            }

            $locked->delete();

            if (User::query()->whereRaw('LOWER(email) = ?', [$email])->exists()) {
                Log::critical('B2B applicant purge: user row still present after delete', [
                    'email' => $email,
                    'user_id' => $userId,
                ]);
            }
        });

        Log::info('B2B applicant user purged (email reusable)', [
            'previous_user_id' => $userId,
            'email' => $email,
        ]);
    }
}
