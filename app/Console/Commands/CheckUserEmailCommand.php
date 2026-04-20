<?php

namespace App\Console\Commands;

use App\Models\AgentVerification;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Read-only: shows whether an email still occupies users / verifications / related tables.
 * Run on production: railway run php artisan b2b:check-email naufalshafi15@gmail.com
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
}
