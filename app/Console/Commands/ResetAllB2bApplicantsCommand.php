<?php

namespace App\Console\Commands;

use App\Models\AgentVerification;
use App\Models\User;
use App\Services\B2bApplicantPurgeService;
use Illuminate\Console\Command;

/**
 * One-shot: remove every agent_verifications applicant and their users row (plus R2/session traces),
 * except privileged admin accounts (those users only lose verification rows).
 */
class ResetAllB2bApplicantsCommand extends Command
{
    protected $signature = 'b2b:reset-all-applicants
                            {--dry-run : Show what would be deleted without changing data}
                            {--force : Required to actually delete (safety)}';

    protected $description = 'Purge all B2B agent verification applicants so the system starts clean';

    public function handle(B2bApplicantPurgeService $purge): int
    {
        $userIds = AgentVerification::query()->distinct()->pluck('user_id')->filter()->values();
        $count = $userIds->count();

        if ($count === 0) {
            $this->info('No agent_verifications rows found. Nothing to do.');

            return self::SUCCESS;
        }

        $this->warn("Found {$count} distinct applicant user_id(s) linked to agent_verifications.");

        if ($this->option('dry-run') || ! $this->option('force')) {
            foreach ($userIds as $userId) {
                $user = User::query()->find($userId);
                $email = $user?->email ?? '(missing user row)';
                $privileged = $user ? $purge->isPrivilegedAdmin($user) : false;
                $this->line("  user_id={$userId} email={$email} privileged=".($privileged ? 'yes (only verification rows removed)' : 'no (full purge)'));
            }
            if (! $this->option('force')) {
                $this->newLine();
                $this->comment('Re-run with --force to execute. Use --dry-run anytime to preview only.');
            }

            return $this->option('dry-run') ? self::SUCCESS : self::FAILURE;
        }

        $purged = 0;
        $skippedAdmin = 0;

        foreach ($userIds as $userId) {
            $user = User::query()->find($userId);
            if ($user === null) {
                $n = 0;
                AgentVerification::query()->where('user_id', $userId)->get()->each(function (AgentVerification $v) use (&$n) {
                    $v->delete();
                    $n++;
                });
                $this->warn("Orphan verification rows for missing user_id={$userId} removed (count={$n}).");

                continue;
            }

            if ($purge->isPrivilegedAdmin($user)) {
                $n = 0;
                AgentVerification::query()->where('user_id', $userId)->get()->each(function (AgentVerification $v) use (&$n) {
                    $v->delete();
                    $n++;
                });
                $this->warn("Privileged user {$user->email}: removed {$n} verification row(s) only (R2 cleaned per row).");
                $skippedAdmin++;

                continue;
            }

            try {
                $purge->purgeApplicantUser($user);
                $purged++;
                $this->info("Purged: {$user->email} (id {$userId})");
            } catch (\Throwable $e) {
                $this->error("Failed user_id={$userId}: {$e->getMessage()}");

                return self::FAILURE;
            }
        }

        $remaining = AgentVerification::query()->count();
        $this->newLine();
        $this->info("Done. Full purges: {$purged}, privileged cleanups: {$skippedAdmin}, agent_verifications remaining: {$remaining}.");

        return self::SUCCESS;
    }
}
