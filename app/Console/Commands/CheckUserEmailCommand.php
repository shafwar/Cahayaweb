<?php

namespace App\Console\Commands;

use App\Models\AgentVerification;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Read-only: shows whether an email still occupies users / verifications / related tables.
 *
 * On Railway, `railway run` executes on your laptop: DB_HOST like mysql.railway.internal will NOT resolve.
 * Use `railway ssh` into your Laravel service, or a public DB URL — see command output on connection failure.
 */
class CheckUserEmailCommand extends Command
{
    protected $signature = 'b2b:check-email {email : Email to inspect}';

    protected $description = 'Report if an email still exists in users or agent verifications (read-only)';

    public function handle(): int
    {
        $email = Str::lower(trim((string) $this->argument('email')));
        if ($email === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email.');

            return self::FAILURE;
        }

        $this->info("Checking: {$email}");
        $this->newLine();

        try {
            return $this->runChecks($email);
        } catch (QueryException $e) {
            $this->newLine();
            $this->error('Database connection failed.');
            $this->line($e->getMessage());
            $this->newLine();
            $this->printRailwayConnectionHelp();

            return self::FAILURE;
        }
    }

    private function runChecks(string $email): int
    {
        $user = User::query()->whereRaw('LOWER(email) = ?', [$email])->first();
        if ($user) {
            $this->warn('BLOCKS registration: row exists in `users` table.');
            $this->line("  user id: {$user->id}");
            $this->line('  name: '.$user->name);
            $this->line('  created_at: '.$user->created_at);
            $vCount = AgentVerification::query()->where('user_id', $user->id)->count();
            $this->line("  agent_verifications rows for this user_id: {$vCount}");
        } else {
            $this->info('OK: no row in `users` with this email — unique check should allow registration.');
        }

        $this->newLine();
        $orphanV = AgentVerification::query()
            ->where(function ($q) use ($email) {
                $q->whereRaw('LOWER(company_email) = ?', [$email])
                    ->orWhereRaw('LOWER(contact_person_email) = ?', [$email]);
            })
            ->count();
        if ($orphanV > 0) {
            $this->warn("Found {$orphanV} agent_verifications row(s) matching company/contact email (unusual if no user).");
        }

        if (Schema::hasTable('password_reset_tokens')) {
            $pr = DB::table('password_reset_tokens')->whereRaw('LOWER(email) = ?', [$email])->count();
            $this->line("password_reset_tokens rows: {$pr} (does not block register, but leftover)");
        }

        $this->newLine();
        if ($user) {
            $this->line('To free this email (hard delete user + traces):');
            $this->line("  php artisan b2b:reclaim-email {$email} --force");
        }

        return self::SUCCESS;
    }

    private function printRailwayConnectionHelp(): void
    {
        $host = (string) config('database.connections.mysql.host', '');
        $this->warn('Why this happens');
        $this->line('  `railway run` runs Artisan on your Mac with env vars from Railway.');
        $this->line('  Hostnames like mysql.railway.internal only work inside Railway’s network, not from your laptop.');
        $this->newLine();
        $this->info('Fix (pick one)');
        $this->line('  1) SSH into your Laravel / PHP service (recommended):');
        $this->line('       railway ssh --service "<name-of-your-web-app-service>"');
        $this->line('       cd /path/to/app  # if needed');
        $this->line('       php artisan b2b:check-email <email>');
        $this->newLine();
        $this->line('  2) Use Railway’s public MySQL host (Dashboard → MySQL → Connect / Variables):');
        $this->line('       export DB_HOST="…public host…" DB_PORT="…" DB_DATABASE="…" DB_USERNAME="…" DB_PASSWORD="…"');
        $this->line('       php artisan b2b:check-email <email>');
        $this->line('     (Do not commit credentials; one-off in your terminal.)');
        $this->newLine();
        $this->line('  3) Link the CLI to your web app service, not only MySQL:');
        $this->line('       railway service   # then pick the Laravel service');
        $this->line('     Still use (1) or (2) unless you use a public DATABASE_URL for local runs.');
        if ($host !== '') {
            $this->newLine();
            $this->line("  Current config DB host: {$host}");
        }
    }
}
