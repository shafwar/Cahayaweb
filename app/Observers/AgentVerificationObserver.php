<?php

namespace App\Observers;

use App\Models\AgentVerification;
use App\Support\AgentVerificationFileCleanup;
use Illuminate\Support\Facades\Log;

class AgentVerificationObserver
{
    /**
     * Before the row is removed: delete files on R2/public so storage stays in sync with the DB.
     */
    public function deleting(AgentVerification $verification): void
    {
        try {
            AgentVerificationFileCleanup::purgeStorageFor($verification);
        } catch (\Throwable $e) {
            Log::error('AgentVerificationObserver: storage cleanup failed (row will still delete)', [
                'verification_id' => $verification->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
