<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;

/**
 * Extends default StartSession: before the session is loaded, if the browser
 * has the signed admin persistence cookie, apply the long admin session lifetime
 * so server-side sessions are not expired while the admin is away.
 */
class StartSessionWithAdminConfig extends StartSession
{
    public const COOKIE_NAME = 'cahaya_admin_persistent';

    public function handle($request, Closure $next)
    {
        $this->applyPersistentAdminLifetime($request);

        return parent::handle($request, $next);
    }

    protected function applyPersistentAdminLifetime(Request $request): void
    {
        $token = $request->cookie(self::COOKIE_NAME);
        if ($token === null || $token === '' || ! ctype_digit((string) $token)) {
            return;
        }

        $minutes = (int) config('session.admin_lifetime_minutes', 525600);
        if ($minutes > 0) {
            config(['session.lifetime' => $minutes]);
        }
    }
}
