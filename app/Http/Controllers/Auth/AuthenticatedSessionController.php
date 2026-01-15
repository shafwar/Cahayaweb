<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request)
    {
        // If user is already logged in and trying to access B2B login, redirect them
        $user = $request->user();
        $mode = $request->query('mode');

        if ($user && $mode === 'b2b') {
            // Check if user is admin
            $isAdmin = ($user->role ?? null) === 'admin' ||
                in_array($user->email, config('app.admin_emails', []), true);

            if ($isAdmin) {
                // Redirect admin away from B2B login
                return redirect('/admin')->with('error', 'Admin accounts cannot access B2B portal. Please use the admin dashboard.');
            }

            // If user already has B2B access, redirect to B2B index
            if ($user->hasB2BAccess()) {
                return redirect()->route('b2b.index');
            }

            // If user doesn't have B2B access, redirect to registration
            return redirect()->route('b2b.register');
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'mode' => $request->query('mode'),
            'redirect' => $request->query('redirect'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // Check mode parameter
        $mode = $request->input('mode');

        // Block admin login if coming from B2B mode
        if ($mode === 'b2b') {
            // Use same admin check logic as IsAdmin middleware
            $isAdmin = false;
            if ($user) {
                if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
                    $isAdmin = true;
                }
                if (!$isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                    $isAdmin = true;
                }
            }

            if ($isAdmin) {
                // Logout the admin immediately
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                // Return error message
                return back()->withErrors([
                    'email' => 'Admin accounts cannot login through B2B portal. Please use the admin login page directly.',
                ])->withInput($request->only('email'));
            }
        }

        // For admin mode, verify user is actually an admin
        if ($mode === 'admin') {
            // Use same admin check logic as IsAdmin middleware
            $isAdmin = false;
            if ($user) {
                if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
                    $isAdmin = true;
                }
                if (!$isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                    $isAdmin = true;
                }
            }

            if (!$isAdmin) {
                // Logout non-admin user immediately
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                // Return error message
                return back()->withErrors([
                    'email' => 'This account does not have admin access. Please login with an admin account.',
                ])->withInput($request->only('email'));
            }

            // Admin verified - redirect to admin dashboard
            // For Inertia requests, use location redirect
            if ($request->header('X-Inertia')) {
                return Inertia::location('/admin');
            }
            return redirect('/admin');
        }

        $redirectTarget = $this->determineRedirectTarget($request);

        // Inertia form submissions expect a location response instead of a plain redirect
        if ($request->header('X-Inertia')) {
            return Inertia::location($redirectTarget);
        }

        return redirect()->intended($redirectTarget);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        try {
            // Regenerate CSRF token before logout to prevent 419 errors
            $request->session()->regenerateToken();

            // Logout user
            Auth::guard('web')->logout();

            // Invalidate session
            $request->session()->invalidate();

            // Regenerate session ID for security
            $request->session()->regenerate();
        } catch (\Exception $e) {
            // If there's any error, still try to logout gracefully
            try {
                // Try to logout even if session operations fail
                if (Auth::check()) {
                    Auth::guard('web')->logout();
                }
            } catch (\Exception $logoutError) {
                // Ignore logout errors - user might already be logged out
            }
        }

        // For Inertia requests, use location redirect to ensure clean state
        if ($request->header('X-Inertia')) {
            return Inertia::location('/');
        }

        // Always redirect to home
        return redirect('/');
    }

    protected function determineRedirectTarget(Request $request): string
    {
        $user = $request->user();

        // Check if user is admin - use same logic as IsAdmin middleware
        $isAdmin = false;
        if ($user) {
            if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
                $isAdmin = true;
            }
            if (!$isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                $isAdmin = true;
            }
        }

        // Check mode parameter first
        $mode = $request->input('mode');

        // If admin mode, redirect to admin dashboard
        if ($mode === 'admin') {
            // Should have been verified in store() method, but double check
            if ($isAdmin) {
                return '/admin';
            }
            // If somehow non-admin got through, redirect to home
            return route('home', absolute: false);
        }

        // If B2B mode, ensure admin is not redirected (should have been blocked already)
        if ($mode === 'b2b') {
            // Double check - if somehow admin got through, redirect to admin dashboard
            if ($isAdmin) {
                return '/admin';
            }
            // If user doesn't have B2B access, redirect to registration form
            if (!$user->hasB2BAccess()) {
                return route('b2b.register', absolute: false);
            }
            return route('b2b.index', absolute: false);
        }

        // For admin users (not in B2B or admin mode), redirect to /admin
        if ($isAdmin) {
            // Check if there's a specific redirect for admin
            $redirect = $request->input('redirect');
            if (is_string($redirect) && str_starts_with($redirect, '/admin')) {
                return $redirect;
            }
            // Default admin redirect
            return '/admin';
        }

        // For non-admin users, check redirect parameter
        $redirect = $request->input('redirect');
        if (is_string($redirect) && str_starts_with($redirect, '/')) {
            return $redirect;
        }

        if ($mode === 'b2c') {
            return route('b2c.home', absolute: false);
        }

        // Default redirect for regular users - go to home instead of dashboard
        return route('home', absolute: false);
    }
}
