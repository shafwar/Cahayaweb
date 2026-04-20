<?php

namespace App\Observers;

use App\Models\User;
use App\Support\AgentVerificationFileCleanup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class UserObserver
{
    /**
     * When a user is deleted, FK cascade removes agent_verifications at DB level without Eloquent events.
     * Purge B2B documents before the user row is removed so R2 stays in sync.
     * Clear sessions and password-reset rows so no residual state blocks re-registration with the same email.
     */
    public function deleting(User $user): void
    {
        try {
            foreach ($user->agentVerifications()->get() as $verification) {
                AgentVerificationFileCleanup::purgeStorageFor($verification);
            }
        } catch (\Throwable $e) {
            Log::error('UserObserver: agent verification file cleanup failed before user delete', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }

        try {
            if (Schema::hasTable('sessions')) {
                DB::table('sessions')->where('user_id', $user->id)->delete();
            }
        } catch (\Throwable $e) {
            Log::warning('UserObserver: session cleanup failed before user delete', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }

        try {
            if (Schema::hasTable('password_reset_tokens')) {
                DB::table('password_reset_tokens')->where('email', $user->email)->delete();
            }
        } catch (\Throwable $e) {
            Log::warning('UserObserver: password_reset_tokens cleanup failed before user delete', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
