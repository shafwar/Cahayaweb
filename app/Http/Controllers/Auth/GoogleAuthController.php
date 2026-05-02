<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Auth\Concerns\DeterminesLoginRedirectTarget;
use App\Http\Controllers\B2cRegistrationController;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

class GoogleAuthController extends Controller
{
    use DeterminesLoginRedirectTarget;

    private const SESSION_INTENT_KEY = 'google_oauth_intent';

    /**
     * Redirect the user to Google's OAuth consent screen.
     */
    public function redirect(Request $request)
    {
        if (! filled(config('services.google.client_id')) || ! filled(config('services.google.client_secret'))) {
            abort(404);
        }

        $validated = $request->validate([
            'mode' => ['nullable', 'string', 'in:admin,b2b,b2c'],
            'redirect' => ['nullable', 'string', 'max:2048'],
            'entry' => ['nullable', 'string', 'in:login,register'],
        ]);

        $request->session()->put(self::SESSION_INTENT_KEY, [
            'mode' => $validated['mode'] ?? null,
            'redirect' => $validated['redirect'] ?? null,
            'entry' => $validated['entry'] ?? 'login',
        ]);

        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google's OAuth callback: find or create user, log in, reuse existing portal redirect rules.
     */
    public function callback(Request $request): RedirectResponse
    {
        if (! filled(config('services.google.client_id'))) {
            abort(404);
        }

        /** @var array{mode?: ?string, redirect?: ?string, entry?: ?string} $intent */
        $intent = $request->session()->pull(self::SESSION_INTENT_KEY, []) ?: [];

        try {
            /** @var SocialiteUser $googleUser */
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            Log::warning('Google OAuth callback failed', ['message' => $e->getMessage()]);

            return $this->oauthFailedRedirect($intent);
        }

        $googleId = $googleUser->getId();
        $email = $googleUser->getEmail();
        $name = $googleUser->getName() ?: (strstr((string) $email, '@', true) ?: 'User');

        if ($googleId === '' || ! is_string($email) || $email === '') {
            return $this->oauthFailedRedirect($intent);
        }

        $mode = $intent['mode'] ?? null;
        $entry = $intent['entry'] ?? 'login';

        if ($mode === 'b2c' && $entry === 'register') {
            $pending = $request->session()->get(B2cRegistrationController::SESSION_PENDING_REGISTRATION);
            if (! is_array($pending) || ! isset($pending['participant']['email'])) {
                return redirect()->route('register', array_filter([
                    'mode' => 'b2c',
                    'redirect' => $intent['redirect'] ?? null,
                ]))->withErrors([
                    'email' => 'Your package registration session expired or was not found. Please submit the package form again.',
                ]);
            }
            if (strtolower($email) !== strtolower((string) $pending['participant']['email'])) {
                return redirect()->route('register', array_filter([
                    'mode' => 'b2c',
                    'redirect' => $intent['redirect'] ?? null,
                ]))->withErrors([
                    'email' => 'Your Google account email must match the one you used on the package registration form.',
                ]);
            }
        }

        $user = User::query()->where('google_id', $googleId)->first();

        if ($user === null) {
            $user = User::query()->whereRaw('LOWER(email) = ?', [strtolower($email)])->first();
            if ($user !== null) {
                if ($user->google_id !== null && $user->google_id !== $googleId) {
                    return redirect()->route('login', array_filter([
                        'mode' => $intent['mode'] ?? null,
                        'redirect' => $intent['redirect'] ?? null,
                    ]))->withErrors([
                        'email' => 'This email is already linked to a different Google account. Sign in with email and password or use the matching Google account.',
                    ]);
                }
                $user->forceFill(['google_id' => $googleId])->save();
            }
        }

        $created = false;
        if ($user === null) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'password' => Hash::make(Str::random(48)),
                'email_verified_at' => now(),
            ]);
            $created = true;
        }

        if ($created) {
            try {
                event(new Registered($user));
            } catch (\Throwable $e) {
                Log::warning('Registered event failed after Google signup', [
                    'user_id' => $user->id,
                    'message' => $e->getMessage(),
                ]);
            }
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        $request->merge([
            'mode' => $intent['mode'] ?? null,
            'redirect' => $intent['redirect'] ?? null,
        ]);

        $blocked = $this->enforcePortalRulesAfterOAuth($request, $user, $intent);
        if ($blocked !== null) {
            return $blocked;
        }

        if (
            $request->session()->has('b2b_registration_data')
            || (($intent['mode'] ?? '') === 'b2b' && $entry === 'register')
        ) {
            return $this->redirectB2bAfterOAuth($request, $intent);
        }

        $redirectPath = $intent['redirect'] ?? null;
        if (($intent['mode'] ?? '') === 'b2c' && $entry === 'register' && is_string($redirectPath)) {
            $pathOnly = self::redirectPathWithoutQuery($redirectPath);
            if ($pathOnly !== null && preg_match('#^/packages/register/[^/]+/finalize$#', $pathOnly)) {
                return redirect()->to($this->normalizeContinueUrlForRequest($request, $redirectPath));
            }
        }

        $target = $this->determineRedirectTarget($request);

        return redirect()->to($target);
    }

    /**
     * @param  array{mode?: ?string, redirect?: ?string}  $intent
     */
    private function oauthFailedRedirect(array $intent): RedirectResponse
    {
        return redirect()->route('login', array_filter([
            'mode' => $intent['mode'] ?? null,
            'redirect' => $intent['redirect'] ?? null,
        ]))->withErrors([
            'email' => 'Google sign-in failed or was cancelled. Please try again or use email and password.',
        ]);
    }

    /**
     * @param  array{mode?: ?string, redirect?: ?string}  $intent
     */
    private function enforcePortalRulesAfterOAuth(Request $request, User $user, array $intent): ?RedirectResponse
    {
        $mode = $intent['mode'] ?? null;

        $isAdmin = false;
        try {
            if ($user->getAttribute('role') === 'admin') {
                $isAdmin = true;
            }
            if (! $isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                $isAdmin = true;
            }
        } catch (\Throwable) {
            $isAdmin = false;
        }

        if ($mode === 'b2b' && $isAdmin) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login', [
                'mode' => 'b2b',
                'redirect' => $intent['redirect'] ?? null,
            ])->withErrors([
                'email' => 'Admin accounts cannot login through B2B portal. Please use the admin login page directly.',
            ]);
        }

        if ($mode === 'admin' && ! $isAdmin) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login', ['mode' => 'admin'])->withErrors([
                'email' => 'This account does not have admin access. Please login with an admin account.',
            ]);
        }

        return null;
    }

    /**
     * @param  array{mode?: ?string, redirect?: ?string}  $intent
     */
    private function redirectB2bAfterOAuth(Request $request, array $intent): RedirectResponse
    {
        $redirect = $intent['redirect'] ?? null;
        $continueUrl = null;
        if (is_string($redirect)) {
            $path = str_starts_with($redirect, '/') ? explode('?', $redirect, 2)[0] : (parse_url($redirect, PHP_URL_PATH) ?: '');
            $query = str_starts_with($redirect, '/') ? (explode('?', $redirect, 2)[1] ?? '') : (parse_url($redirect, PHP_URL_QUERY) ?? '');
            if ($path && str_contains($path, '/b2b/register/continue')) {
                $continueUrl = $path.($query !== '' ? '?'.$query : '');
            }
        }
        if ($continueUrl === null) {
            $continueUrl = route('b2b.register.store.continue', absolute: false);
        }
        $continueUrl = $this->normalizeContinueUrlForRequest($request, $continueUrl);
        if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
            $continueUrl = preg_replace('#^http://#', 'https://', $continueUrl) ?? $continueUrl;
        }

        return redirect()->to($continueUrl);
    }

    private function normalizeContinueUrlForRequest(Request $request, string $url): string
    {
        if (! str_starts_with($url, 'http://') && ! str_starts_with($url, 'https://')) {
            return $url;
        }

        $targetHost = parse_url($url, PHP_URL_HOST);
        $currentHost = $request->getHost();
        if ($targetHost === $currentHost || $targetHost === null) {
            $path = parse_url($url, PHP_URL_PATH) ?: '/';
            $query = parse_url($url, PHP_URL_QUERY);

            return $query !== null && $query !== '' ? $path.'?'.$query : $path;
        }

        return $url;
    }

    private static function redirectPathWithoutQuery(string $redirect): ?string
    {
        if (str_starts_with($redirect, '/')) {
            return explode('?', $redirect, 2)[0];
        }
        if (str_starts_with($redirect, 'http://') || str_starts_with($redirect, 'https://')) {
            return parse_url($redirect, PHP_URL_PATH) ?: null;
        }

        return null;
    }
}
