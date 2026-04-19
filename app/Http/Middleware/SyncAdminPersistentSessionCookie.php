<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * After the session is loaded and the user is known: keep the admin persistence
 * cookie aligned with the logged-in admin, or drop it if it does not match.
 */
class SyncAdminPersistentSessionCookie
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $user = $request->user();
        if (! $user instanceof User) {
            return $response;
        }

        if (! $this->userIsAdmin($user)) {
            if ($request->cookie(StartSessionWithAdminConfig::COOKIE_NAME) !== null) {
                return $this->forgetCookieOnResponse($response);
            }

            return $response;
        }

        $expected = (string) $user->id;
        $current = $request->cookie(StartSessionWithAdminConfig::COOKIE_NAME);

        if ($current !== $expected) {
            return $this->attachPersistentCookie($response, $expected);
        }

        return $response;
    }

    private function userIsAdmin(User $user): bool
    {
        if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
            return true;
        }

        return in_array($user->email, config('app.admin_emails', []), true);
    }

    private function attachPersistentCookie(Response $response, string $userId): Response
    {
        $minutes = max(1, (int) config('session.admin_lifetime_minutes', 525600));

        $response->headers->setCookie(cookie(
            StartSessionWithAdminConfig::COOKIE_NAME,
            $userId,
            $minutes,
            config('session.path', '/'),
            config('session.domain'),
            config('session.secure'),
            true,
            false,
            config('session.same_site', 'lax'),
        ));

        return $response;
    }

    private function forgetCookieOnResponse(Response $response): Response
    {
        $response->headers->setCookie(cookie(
            StartSessionWithAdminConfig::COOKIE_NAME,
            '',
            -2628000,
            config('session.path', '/'),
            config('session.domain'),
            config('session.secure'),
            true,
            false,
            config('session.same_site', 'lax'),
        ));

        return $response;
    }
}
