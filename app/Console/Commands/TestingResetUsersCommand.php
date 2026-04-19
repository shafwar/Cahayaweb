<?php

namespace App\Console\Commands;

use App\Models\B2BRegistrationDraft;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Removes non-admin users and related rows so registration can be re-tested with the same email.
 * Production use requires an explicit flag — destructive.
 */
class TestingResetUsersCommand extends Command
{
    protected $signature = 'testing:reset-users
                            {--yes : Skip interactive confirmation}
                            {--include-admins : Also delete accounts listed in config(\'app.admin_emails\')}
                            {--i-understand-production : Required when APP_ENV=production}';

    protected $description = 'Delete users (except admin emails by default), cascade agent verifications, clear B2B drafts, sessions, and password reset tokens';

    public function handle(): int
    {
        if (app()->environment('production') && ! $this->option('i-understand-production')) {
            $this->error('Refusing to run in production without --i-understand-production (this deletes user data).');

            return 1;
        }

        if (! $this->option('yes')) {
            if (! $this->confirm('This will DELETE users and related data. Continue?', false)) {
                $this->info('Aborted.');

                return 0;
            }
        }

        $adminEmails = array_values(array_unique(array_map('strtolower', config('app.admin_emails', []))));

        if (! $this->option('include-admins') && $adminEmails === []) {
            $this->error('config(\'app.admin_emails\') is empty. Refusing to delete all users. Set admin_emails or pass --include-admins.');

            return 1;
        }

        $deleted = 0;
        $includeAdmins = (bool) $this->option('include-admins');

        DB::transaction(function () use ($adminEmails, &$deleted, $includeAdmins) {
            B2BRegistrationDraft::query()->delete();

            User::query()->orderBy('id')->chunkById(50, function ($users) use ($adminEmails, &$deleted, $includeAdmins) {
                foreach ($users as $user) {
                    if (! $includeAdmins && in_array(strtolower((string) $user->email), $adminEmails, true)) {
                        continue;
                    }
                    $user->delete();
                    $deleted++;
                }
            });

            DB::table('password_reset_tokens')->truncate();
            DB::table('sessions')->truncate();
        });

        $this->info("Deleted {$deleted} user(s). B2C registrations keep rows with user_id set to NULL when a user is removed.");
        $this->info('Password reset tokens and sessions cleared.');

        return 0;
    }
}
