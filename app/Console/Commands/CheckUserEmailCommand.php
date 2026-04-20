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
            $this->printConnectionHelp($e, $email);

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

    private function printConnectionHelp(QueryException $e, string $email): void
    {
        $msg = strtolower($e->getMessage());
        $default = (string) config('database.default');
        $cfg = config('database.connections.'.$default) ?? [];
        $driver = (string) ($cfg['driver'] ?? $default);
        $loc = ($driver === 'sqlite')
            ? 'database: '.($cfg['database'] ?? '')
            : 'host: '.($cfg['host'] ?? 'n/a').', database: '.($cfg['database'] ?? '');

        $this->line("  Configured: {$driver} ({$loc})");
        $this->newLine();

        $isLocalMysql = str_contains($msg, '127.0.0.1') || str_contains($msg, 'localhost');
        $isConnRefused = str_contains($msg, 'connection refused');
        $isRailwayInternal = str_contains($msg, 'railway.internal') || str_contains($msg, 'getaddrinfo');

        if ($isLocalMysql && $isConnRefused) {
            $this->warn('Diagnosis: Artisan is using your local .env (e.g. Herd / 127.0.0.1), and MySQL is not running or not reachable.');
            $this->line('  The second command (`php artisan …`) ran on your Mac, not inside `railway ssh` (SSH did not open — wrong service name or missing link).');
            $this->newLine();
            $this->info('Do this (Railway — inspect production DB)');
            $this->line('  From your project folder that is `railway link`-ed to **Cahaya Anbiya / production**:');
            $this->line('    railway service          # pick your **Laravel / web** service, NOT MySQL');
            $this->line('    railway ssh              # opens a shell **on the server** (use real service link)');
            $this->line("    php artisan b2b:check-email {$email}");
            $this->newLine();
            $this->line('  If you see "Must provide project": run `railway link` again in this directory, then retry.');
            $this->line('  Never use the literal placeholder `NAMA_SERVICE_LARAVEL_ANDA` — use the real service name from the menu.');
            $this->newLine();
        }

        if ($isRailwayInternal) {
            $this->warn('Diagnosis: `railway run` injects DB_HOST=mysql.railway.internal — that hostname does not resolve on your laptop.');
            $this->newLine();
            $this->info('Use `railway ssh` into the web service (see above), or set a public MySQL host in your shell and run php artisan locally.');
            $this->newLine();
        }

        $this->info('Verify script locally (no Railway)');
        $this->line('  DB_CONNECTION=sqlite DB_DATABASE=/tmp/test.sqlite php artisan migrate --force');
        $this->line('  DB_CONNECTION=sqlite DB_DATABASE=/tmp/test.sqlite php artisan b2b:check-email you@example.com');
        $this->newLine();

        $this->info('Alternative: public MySQL from Railway Dashboard');
        $this->line('  MySQL service → Connect → copy host/port/user/pass → export DB_* then run php artisan b2b:check-email … on your Mac.');
    }
}
