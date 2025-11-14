<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            abort(403);
        }

        // Flexible admin check: role === 'admin' OR email in allowlist
        $isAdmin = false;
        if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
            $isAdmin = true;
        }
        if (! $isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
            $isAdmin = true;
        }

        if (! $isAdmin) {
            abort(403);
        }

        return $next($request);
    }
}


