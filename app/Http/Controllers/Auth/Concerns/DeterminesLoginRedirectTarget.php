<?php

namespace App\Http\Controllers\Auth\Concerns;

use Illuminate\Http\Request;

trait DeterminesLoginRedirectTarget
{
    protected function determineRedirectTarget(Request $request): string
    {
        $user = $request->user();

        $isAdmin = false;
        try {
            if ($user) {
                if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
                    $isAdmin = true;
                }
                if (! $isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                    $isAdmin = true;
                }
            }
        } catch (\Throwable $e) {
            \Log::debug('Error checking admin status in determineRedirectTarget', [
                'error' => $e->getMessage(),
            ]);
        }

        $mode = $request->input('mode');

        if ($mode === 'admin') {
            if ($isAdmin) {
                return '/admin';
            }

            return route('home', absolute: false);
        }

        if ($mode === 'b2b') {
            if ($isAdmin) {
                \Log::warning('Admin user detected in B2B mode redirect', [
                    'user_id' => $user?->id,
                ]);

                return '/admin';
            }

            $redirect = $request->input('redirect');
            if (is_string($redirect)) {
                $path = str_starts_with($redirect, '/') ? $redirect : (parse_url($redirect, PHP_URL_PATH) ?: '');
                if ($path && str_starts_with($path, '/b2b/register/continue')) {
                    return $path;
                }
            }

            try {
                $hasB2BAccess = $user && $user->hasB2BAccess();

                \Log::info('B2B access check', [
                    'user_id' => $user?->id,
                    'has_b2b_access' => $hasB2BAccess,
                ]);

                if (! $user || ! $hasB2BAccess) {
                    \Log::info('User does not have B2B access - redirecting to registration', [
                        'user_id' => $user?->id,
                    ]);

                    return route('b2b.register', absolute: false);
                }

                \Log::info('User has B2B access - redirecting to B2B index', [
                    'user_id' => $user?->id,
                ]);

                return route('b2b.index', absolute: false);
            } catch (\Throwable $e) {
                \Log::error('Error checking B2B access in determineRedirectTarget', [
                    'user_id' => $user?->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                return route('b2b.register', absolute: false);
            }
        }

        if ($isAdmin) {
            $redirect = $request->input('redirect');
            if (is_string($redirect) && str_starts_with($redirect, '/admin')) {
                return $redirect;
            }

            return '/admin';
        }

        $redirect = $request->input('redirect');
        if (is_string($redirect)) {
            if (str_starts_with($redirect, '/')) {
                return $redirect;
            }
            if (str_starts_with($redirect, 'http://') || str_starts_with($redirect, 'https://')) {
                $path = parse_url($redirect, PHP_URL_PATH) ?: '';
                $query = parse_url($redirect, PHP_URL_QUERY);

                return $query ? $path.'?'.$query : $path;
            }
        }

        if ($mode === 'b2c') {
            return route('b2c.account', absolute: false);
        }

        return route('home', absolute: false);
    }
}
