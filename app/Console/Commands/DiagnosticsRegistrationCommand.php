<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;

/**
 * Run on the server (or locally) when B2B/register flow misbehaves: prints config + route checks.
 * Does not expose secrets. Pair with: tail -f storage/logs/laravel.log | grep -i register
 */
class DiagnosticsRegistrationCommand extends Command
{
    protected $signature = 'diagnostics:registration';

    protected $description = 'Check routes and session settings relevant to /register and B2B post-register redirect';

    public function handle(): int
    {
        $this->info('=== Registration / B2B flow diagnostics ===');
        $this->newLine();

        $routes = [
            'register (GET)' => 'register',
            'register (POST)' => null,
            'auth.csrf-token' => 'auth.csrf-token',
            'b2b.register.store.continue' => 'b2b.register.store.continue',
        ];

        foreach ($routes as $label => $name) {
            if ($name === null) {
                $this->line(sprintf('  %-28s POST /register (guest)', $label));

                continue;
            }
            try {
                $url = Route::has($name) ? route($name, absolute: false) : '(missing)';
                $this->line(sprintf('  %-28s %s', $label, $url));
            } catch (\Throwable $e) {
                $this->error(sprintf('  %-28s ERROR: %s', $label, $e->getMessage()));
            }
        }

        $this->newLine();
        $this->info('Session / app');
        $this->line('  SESSION_DRIVER       = '.config('session.driver'));
        $this->line('  SESSION_SECURE       = '.(config('session.secure') ? 'true' : 'false'));
        $this->line('  SESSION_SAME_SITE    = '.(string) config('session.same_site'));
        $this->line('  APP_URL              = '.(string) config('app.url'));
        $this->line('  APP_ENV              = '.(string) config('app.environment'));

        $this->newLine();
        $this->info('Inertia note');
        $this->line('  Browser POST /register sends X-Inertia. Success must use Inertia::location()');
        $this->line('  (409 + X-Inertia-Location) so the client does a full visit to /b2b/register/continue');
        $this->line('  with the session cookie — same pattern as login.');

        $this->newLine();
        $this->info('Live log (run while reproducing register in browser)');
        $this->line('  tail -f storage/logs/laravel.log | grep -iE "registration|B2B post-register|B2B continue"');

        $this->newLine();
        $this->info('Optional: REGISTER_DEBUG=1 in .env adds verbose registration logs (no passwords).');

        $this->newLine();
        $this->info('Ghost email (still "already registered" after admin delete):');
        $this->line('  php artisan b2b:reclaim-email you@example.com --force');

        $this->newLine();
        $this->info('Check if an email still exists in DB (read-only):');
        $this->line('  php artisan b2b:check-email you@example.com');

        return self::SUCCESS;
    }
}
