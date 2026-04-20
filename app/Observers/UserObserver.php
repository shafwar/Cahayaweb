<?php

namespace App\Observers;

use App\Models\AgentVerification;
use App\Models\User;
use App\Support\AgentVerificationFileCleanup;
use Illuminate\Support\Facades\Log;

class UserObserver
{
    /**
     * When a user is deleted, FK cascade removes agent_verifications at DB level without Eloquent events.
     * Purge B2B documents before the user row is removed so R2 stays in sync.
     */
    public function deleting(User $user): void
    {
        try {
            foreach (AgentVerification::query()->where('user_id', $user->id)->cursor() as $verification) {
                AgentVerificationFileCleanup::purgeStorageFor($verification);
            }
        } catch (\Throwable $e) {
            Log::error('UserObserver: agent verification file cleanup failed before user delete', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
