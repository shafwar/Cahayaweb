<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\B2bApplicantPurgeService;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Deletes every row in `users` except privileged admin accounts (same rules as IsAdmin / B2bApplicantPurgeService).
 * Uses B2bApplicantPurgeService per user so R2, sessions, tokens, and cascades stay consistent.
 *
 * Production: railway ssh (Laravel service) → `php artisan …` or `sh scripts/railway-artisan.sh …`
 * If `php: command not found`, use `/usr/local/bin/php artisan …` or the helper script above.
 */
class PurgeNonAdminUsersCommand extends Command
{
    protected $signature = 'users:purge-except-admins
                            {--dry-run : List who would be kept/deleted without changing data}
                            {--force : Required to actually delete}
                            {--except=* : Extra emails to always keep (case-insensitive, repeatable)}';

    protected $description = 'Remove all users except admins (role=admin or APP_ADMIN_EMAILS) and optional --except emails';

    public function handle(B2bApplicantPurgeService $purge): int
    {
        $except = collect($this->option('except'))
            ->map(fn (string $e) => Str::lower(trim($e)))
            ->filter()
            ->unique()
            ->values();

        $users = User::query()->orderBy('id')->get();

        $keep = [];
        $remove = [];

        foreach ($users as $user) {
            $emailLower = Str::lower((string) $user->email);
            $privileged = $purge->isPrivilegedAdmin($user);
            $inExcept = $except->contains($emailLower);

            if ($privileged || $inExcept) {
                $keep[] = [
                    'id' => $user->id,
                    'email' => $user->email,
                    'reason' => $privileged ? 'admin' : '--except',
                ];
            } else {
                $remove[] = $user;
            }
        }

        if (count($keep) === 0) {
            $this->error('No users would be kept. Configure APP_ADMIN_EMAILS (comma-separated) and/or set role=admin on your admin row, or pass --except=you@domain.com');
            $this->line('Refusing to run: deleting every user would lock you out.');

            return self::FAILURE;
        }

        $this->info('Will KEEP ('.count($keep).'):');
        foreach ($keep as $row) {
            $this->line("  id={$row['id']} email={$row['email']} ({$row['reason']})");
        }

        $this->newLine();
        $this->warn('Will REMOVE ('.count($remove).'):');
        foreach ($remove as $user) {
            $this->line("  id={$user->id} email={$user->email}");
        }

        if ($this->option('dry-run') || ! $this->option('force')) {
            $this->newLine();
            $this->comment($this->option('dry-run')
                ? 'Dry run only — no changes.'
                : 'Re-run with --force to execute deletions.');

            return $this->option('dry-run') ? self::SUCCESS : self::FAILURE;
        }

        $ok = 0;
        foreach ($remove as $user) {
            try {
                $purge->purgeApplicantUser($user);
                $ok++;
                $this->info("Removed: {$user->email} (id {$user->id})");
            } catch (\Throwable $e) {
                $this->error("Failed id={$user->id} {$user->email}: {$e->getMessage()}");

                return self::FAILURE;
            }
        }

        $this->newLine();
        $this->info("Done. Removed {$ok} user(s). Remaining users: ".User::query()->count().'.');

        return self::SUCCESS;
    }
}
