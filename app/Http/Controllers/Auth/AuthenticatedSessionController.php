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
        // CRITICAL: Always regenerate CSRF token on every page load
        // This ensures a fresh token is ALWAYS available for login, preventing 419 errors
        // No conditional checks - just regenerate every time to guarantee freshness
        try {
            // Always regenerate session to ensure fresh session ID
            // This prevents session fixation and ensures clean state
            $request->session()->regenerate();
            
            // Always regenerate CSRF token for fresh token
            // This is critical - token must be fresh on every page load
            $request->session()->regenerateToken();
            
            // Record activity time for session management
            $request->session()->put('_token_last_activity', time());
            
            // Force session to be saved immediately to prevent race conditions
            $request->session()->save();
        } catch (\Throwable $e) {
            // If regeneration fails, still try to regenerate token
            // This ensures we always have a token, even if session operations fail
            try {
                $request->session()->regenerateToken();
                $request->session()->save();
            } catch (\Throwable $tokenError) {
                \Log::warning('Failed to regenerate CSRF token in login page', [
                    'error' => $tokenError->getMessage()
                ]);
            }
        }

        // If user is already logged in and trying to access B2B login, redirect them
        try {
            $user = $request->user();
            $mode = $request->query('mode');

            if ($user && $mode === 'b2b') {
                // Check if user is admin - wrap in try-catch for safety
                $isAdmin = false;
                try {
                    $isAdmin = ($user->role ?? null) === 'admin' ||
                        in_array($user->email, config('app.admin_emails', []), true);
                } catch (\Throwable $e) {
                    \Log::warning('Error checking admin status in login page', [
                        'error' => $e->getMessage()
                    ]);
                }

                if ($isAdmin) {
                    // Redirect admin away from B2B login
                    return redirect('/admin')->with('error', 'Admin accounts cannot access B2B portal. Please use the admin dashboard.');
                }

                // If user already has B2B access, redirect to B2B index
                // Wrap in try-catch to prevent errors if method doesn't exist or relation fails
                try {
                    if (method_exists($user, 'hasB2BAccess') && $user->hasB2BAccess()) {
                        return redirect()->route('b2b.index');
                    }
                } catch (\Throwable $e) {
                    \Log::warning('Error checking B2B access in login page', [
                        'user_id' => $user->id ?? null,
                        'error' => $e->getMessage()
                    ]);
                    // Continue to registration if check fails
                }

                // If user doesn't have B2B access, redirect to registration
                try {
                    return redirect()->route('b2b.register');
                } catch (\Throwable $e) {
                    \Log::error('Error redirecting to B2B register', [
                        'error' => $e->getMessage()
                    ]);
                    // Fall through to render login page if route doesn't exist
                }
            }
        } catch (\Throwable $e) {
            // Log error but continue to render login page
            \Log::error('Error in login page user check', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        // CRITICAL: Set no-cache headers to prevent browser from caching login page
        // This ensures user always gets fresh CSRF token, simulating "hard refresh"
        try {
            $canResetPassword = false;
            try {
                $canResetPassword = Route::has('password.request');
            } catch (\Throwable $e) {
                \Log::debug('Route::has() check failed', ['error' => $e->getMessage()]);
            }

            $response = Inertia::render('auth/login', [
                'canResetPassword' => $canResetPassword,
                'status' => $request->session()->get('status'),
                'mode' => $request->query('mode'),
                'redirect' => $request->query('redirect'),
                'error' => $request->session()->get('error'),
            ]);

            // Add cache-control headers to prevent caching
            try {
                $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
                $response->headers->set('Pragma', 'no-cache');
                $response->headers->set('Expires', '0');
                
                // Try to get CSRF token - wrap in try-catch
                try {
                    $csrfToken = csrf_token();
                    if ($csrfToken) {
                        $response->headers->set('X-CSRF-Token', $csrfToken);
                    }
                } catch (\Throwable $e) {
                    \Log::warning('Failed to set X-CSRF-Token header', [
                        'error' => $e->getMessage()
                    ]);
                    // Continue without header - meta tag should still work
                }
            } catch (\Throwable $e) {
                \Log::warning('Failed to set cache headers', [
                    'error' => $e->getMessage()
                ]);
                // Continue without headers - response is still valid
            }

            return $response;
        } catch (\Throwable $e) {
            // Last resort: log error and return basic response
            \Log::error('Fatal error rendering login page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Try to return basic Inertia response without extra data
            try {
                return Inertia::render('auth/login', [
                    'canResetPassword' => false,
                    'status' => null,
                    'mode' => $request->query('mode'),
                    'redirect' => $request->query('redirect'),
                    'error' => 'An error occurred. Please try again.',
                ]);
            } catch (\Throwable $fallbackError) {
                // Absolute last resort: return error response
                \Log::critical('Cannot render login page at all', [
                    'error' => $fallbackError->getMessage()
                ]);
                abort(500, 'Unable to load login page. Please try again later.');
            }
        }
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        try {
            // Authenticate user first (before any session operations)
            $request->authenticate();

            // Get user before regenerating session
            $user = Auth::user();

            // Regenerate session ID for security (after authentication succeeds)
            // This prevents session fixation attacks
            // Wrap in try-catch to handle any session errors gracefully
            try {
                $request->session()->regenerate();
                // Regenerate CSRF token after session regeneration
                // This ensures the token is fresh and valid
                $request->session()->regenerateToken();
            } catch (\Throwable $sessionError) {
                // If session regeneration fails, log but continue
                // The user is already authenticated, so we can proceed
                \Log::warning('Session regeneration failed during login', [
                    'user_id' => $user?->id,
                    'error' => $sessionError->getMessage()
                ]);
                // Try to regenerate token anyway
                try {
                    $request->session()->regenerateToken();
                } catch (\Throwable $tokenError) {
                    \Log::warning('Token regeneration also failed', [
                        'error' => $tokenError->getMessage()
                    ]);
                }
            }

            // Check mode parameter
            $mode = $request->input('mode');

            // Block admin login if coming from B2B mode
            if ($mode === 'b2b') {
                // Use same admin check logic as IsAdmin middleware
                $isAdmin = false;
                try {
                    if ($user) {
                        if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
                            $isAdmin = true;
                        }
                        if (!$isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                            $isAdmin = true;
                        }
                    }
                } catch (\Throwable $adminCheckError) {
                    \Log::warning('Error checking admin status during B2B login', [
                        'user_id' => $user?->id,
                        'error' => $adminCheckError->getMessage()
                    ]);
                    // If we can't determine admin status, allow login to proceed
                }

                if ($isAdmin) {
                    // Logout the admin immediately
                    try {
                        Auth::guard('web')->logout();
                        $request->session()->invalidate();
                        $request->session()->regenerateToken();
                    } catch (\Throwable $logoutError) {
                        \Log::warning('Error during admin logout in B2B mode', [
                            'error' => $logoutError->getMessage()
                        ]);
                    }

                    // Return error message - ensure Inertia response
                    if ($request->header('X-Inertia')) {
                        return back()->withErrors([
                            'email' => 'Admin accounts cannot login through B2B portal. Please use the admin login page directly.',
                        ])->withInput($request->only('email'));
                    }
                    return back()->withErrors([
                        'email' => 'Admin accounts cannot login through B2B portal. Please use the admin login page directly.',
                    ])->withInput($request->only('email'));
                }
            }

            // For admin mode, verify user is actually an admin
            if ($mode === 'admin') {
                // Use same admin check logic as IsAdmin middleware
                $isAdmin = false;
                try {
                    if ($user) {
                        if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
                            $isAdmin = true;
                        }
                        if (!$isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                            $isAdmin = true;
                        }
                    }
                } catch (\Throwable $adminCheckError) {
                    \Log::warning('Error checking admin status during admin login', [
                        'user_id' => $user?->id,
                        'error' => $adminCheckError->getMessage()
                    ]);
                    // If we can't determine admin status, treat as non-admin
                }

                if (!$isAdmin) {
                    // Logout non-admin user immediately
                    try {
                        Auth::guard('web')->logout();
                        $request->session()->invalidate();
                        $request->session()->regenerateToken();
                    } catch (\Throwable $logoutError) {
                        \Log::warning('Error during non-admin logout in admin mode', [
                            'error' => $logoutError->getMessage()
                        ]);
                    }

                    // Return error message - ensure Inertia response
                    if ($request->header('X-Inertia')) {
                        return back()->withErrors([
                            'email' => 'This account does not have admin access. Please login with an admin account.',
                        ])->withInput($request->only('email'));
                    }
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

            // Determine redirect target - wrap in try-catch to handle any errors
            try {
                $redirectTarget = $this->determineRedirectTarget($request);
                
                // Log redirect target for debugging
                \Log::info('Login successful - redirecting', [
                    'user_id' => $user?->id,
                    'user_email' => $user?->email,
                    'mode' => $mode,
                    'redirect_target' => $redirectTarget,
                    'has_b2b_access' => $mode === 'b2b' ? ($user?->hasB2BAccess() ?? false) : null,
                ]);
            } catch (\Throwable $redirectError) {
                \Log::error('Error determining redirect target', [
                    'user_id' => $user?->id,
                    'mode' => $mode,
                    'error' => $redirectError->getMessage(),
                    'trace' => $redirectError->getTraceAsString()
                ]);
                // Fallback to home page if redirect determination fails
                $redirectTarget = route('home', absolute: false);
            }

            // Inertia form submissions expect a location response instead of a plain redirect
            if ($request->header('X-Inertia')) {
                // Use Inertia::location() for proper Inertia redirect
                // This ensures the redirect is handled correctly by Inertia
                return Inertia::location($redirectTarget);
            }

            return redirect()->intended($redirectTarget);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Re-throw ValidationException to let it be handled by the exception handler
            throw $e;
        } catch (\Throwable $e) {
            // Log any unexpected errors
            \Log::error('Unexpected error during login', [
                'user_email' => $request->input('email'),
                'mode' => $request->input('mode'),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            // For Inertia requests, return proper Inertia error response
            if ($request->header('X-Inertia')) {
                return back()->withErrors([
                    'email' => 'An error occurred during login. Please try again or refresh the page.',
                ])->withInput($request->only('email'));
            }

            // For regular requests, redirect back with error
            return back()->withErrors([
                'email' => 'An error occurred during login. Please try again.',
            ])->withInput($request->only('email'));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse|SymfonyResponse
    {
        try {
            // Logout user first (before invalidating session)
            // This is safe even if user is already logged out
            if (Auth::check()) {
                Auth::guard('web')->logout();
            }

            // Invalidate session (this will clear all session data)
            // Use try-catch to handle cases where session might already be invalid
            try {
                $request->session()->invalidate();
            } catch (\Exception $sessionError) {
                // Session might already be invalid - that's okay
                \Log::debug('Session already invalid during logout: ' . $sessionError->getMessage());
            }

            // Regenerate session ID for security (creates new empty session)
            // Use try-catch to handle edge cases
            try {
                $request->session()->regenerate();
            } catch (\Exception $regenerateError) {
                // Session regeneration might fail if session was already invalidated
                \Log::debug('Session regeneration failed during logout: ' . $regenerateError->getMessage());
            }

            // Regenerate CSRF token after session regeneration
            // This ensures a fresh token for the next request
            try {
                $request->session()->regenerateToken();
            } catch (\Exception $tokenError) {
                // Token regeneration might fail - that's okay, new session will have new token
                \Log::debug('Token regeneration failed during logout: ' . $tokenError->getMessage());
            }
        } catch (\Exception $e) {
            // Log error for debugging but don't expose to user
            \Log::error('Logout error: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => $request->user()?->id,
            ]);

            // If there's any error, still try to logout gracefully
            try {
                // Try to logout even if session operations fail
                if (Auth::check()) {
                    Auth::guard('web')->logout();
                }
            } catch (\Exception $logoutError) {
                // Ignore logout errors - user might already be logged out
                \Log::debug('Fallback logout also failed (this is usually okay): ' . $logoutError->getMessage());
            }
        }

        // For Inertia requests, use location redirect to ensure clean state
        // This prevents any Page Expired errors by doing a full page redirect
        if ($request->header('X-Inertia')) {
            // Use Inertia::location for a clean redirect without any error pages
            return Inertia::location('/');
        }

        // Always redirect to home - this ensures logout always succeeds
        // even if there were minor errors during session cleanup
        return redirect('/');
    }

    protected function determineRedirectTarget(Request $request): string
    {
        $user = $request->user();

        // Check if user is admin - use same logic as IsAdmin middleware
        $isAdmin = false;
        try {
            if ($user) {
                if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
                    $isAdmin = true;
                }
                if (!$isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                    $isAdmin = true;
                }
            }
        } catch (\Throwable $e) {
            \Log::debug('Error checking admin status in determineRedirectTarget', [
                'error' => $e->getMessage()
            ]);
            // Continue with $isAdmin = false
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
                \Log::warning('Admin user detected in B2B mode redirect', [
                    'user_id' => $user?->id,
                ]);
                return '/admin';
            }
            
            // If user doesn't have B2B access, redirect to registration form
            // Wrap in try-catch to handle any errors from hasB2BAccess()
            try {
                $hasB2BAccess = $user && $user->hasB2BAccess();
                
                \Log::info('B2B access check', [
                    'user_id' => $user?->id,
                    'has_b2b_access' => $hasB2BAccess,
                ]);
                
                if (!$user || !$hasB2BAccess) {
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
                    'trace' => $e->getTraceAsString()
                ]);
                // If error occurs, redirect to registration form as safe fallback
                return route('b2b.register', absolute: false);
            }
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
