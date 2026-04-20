<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\B2bApplicantPurgeService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Use when an email is still blocked after removing agent verifications (e.g. legacy data
 * where only the verification row was deleted). This removes the users row and related traces.
 */
class ReclaimB2bEmailCommand extends Command
{
    protected $signature = 'b2b:reclaim-email {email : Email address to free for new registration} {--force : Skip confirmation prompt}';

    protected $description = 'Hard-delete the users row (and related traces) for an email so registration can reuse it';

    public function handle(B2bApplicantPurgeService $purge): int
    {
        $email = Str::lower(trim((string) $this->argument('email')));
        if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email address.');

            return self::FAILURE;
        }

        $user = User::query()->whereRaw('LOWER(email) = ?', [$email])->first();
        if ($user === null) {
            $this->info("No user found for {$email}. The email is already free.");

            return self::SUCCESS;
        }

        if ($purge->isPrivilegedAdmin($user)) {
            $this->error('This email belongs to a privileged administrator account. Refusing to delete.');

            return self::FAILURE;
        }

        if (! $this->option('force')) {
            if (! $this->confirm("Permanently delete user #{$user->id} ({$user->email}) and all purgeable traces?", false)) {
                $this->warn('Aborted.');

                return self::FAILURE;
            }
        }

        try {
            $purge->purgeApplicantUser($user);
        } catch (\Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }

        $this->info("User removed. {$email} can be used for a new account.");

        return self::SUCCESS;
    }
}
