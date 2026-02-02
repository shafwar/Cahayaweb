<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(Request $request)
    {
        // If user is already logged in and coming from B2B registration, redirect to B2B register
        if ($request->user() && $request->input('mode') === 'b2b') {
            return redirect()->route('b2b.register');
        }

        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        Log::info('Registration attempt', ['email' => $request->input('email')]);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ], [
                'name.required' => 'Name is required.',
                'email.required' => 'Email address is required.',
                'email.email' => 'Please enter a valid email address.',
                'email.unique' => 'This email address is already registered. If this is your account, please log in instead or use a different email address.',
                'password.required' => 'Password is required.',
                'password.confirmed' => 'Password confirmation does not match.',
            ]);

            // Only persist user in transaction. Do NOT fire Registered event inside transaction:
            // if a listener throws (e.g. email), the whole transaction would roll back and the user would not be saved.
            $user = DB::transaction(function () use ($validated) {
                return User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                ]);
            });

            Log::info('User registered successfully', ['user_id' => $user->id, 'email' => $user->email]);

            try {
                event(new Registered($user));
            } catch (\Throwable $e) {
                Log::warning('Registered event failed (user already saved)', [
                    'user_id' => $user->id,
                    'message' => $e->getMessage(),
                ]);
            }

            Auth::login($user);

            // Read mode/redirect from query if not in body (B2B flow when form posts to /register?mode=b2b&redirect=...)
            $mode = $request->input('mode') ?: $request->query('mode');
            $redirect = $request->input('redirect') ?: $request->query('redirect');

            // PRIORITY 1: B2B flow — redirect to continue so verification is created and user lands on pending
            // Prefer redirect param (contains b2b_token) so multi-instance / lost session still works via draft
            if ($request->session()->has('b2b_registration_data') || $mode === 'b2b') {
                $continueUrl = null;
                if (is_string($redirect)) {
                    $path = str_starts_with($redirect, '/') ? explode('?', $redirect, 2)[0] : (parse_url($redirect, PHP_URL_PATH) ?: '');
                    $query = str_starts_with($redirect, '/') ? (explode('?', $redirect, 2)[1] ?? '') : (parse_url($redirect, PHP_URL_QUERY) ?? '');
                    if ($path && str_contains($path, '/b2b/register/continue')) {
                        $continueUrl = $path . ($query !== '' ? '?' . $query : '');
                    }
                }
                if ($continueUrl === null) {
                    $continueUrl = route('b2b.register.store.continue', [], true);
                }
                if ($request->secure() || $request->header('X-Forwarded-Proto') === 'https' || app()->environment('production')) {
                    $continueUrl = preg_replace('#^http://#', 'https://', $continueUrl);
                }
                Log::info('B2B post-register redirect to continue', ['user_id' => $user->id, 'continue_url' => $continueUrl]);
                return redirect($continueUrl);
            }

            // Regenerate session token after successful registration (only if not B2B)
            $request->session()->regenerateToken();

            // PRIORITY 3: Check if there's a redirect parameter (e.g., from B2B registration)
            if ($redirect && is_string($redirect)) {
                $path = null;
                if (str_starts_with($redirect, '/')) {
                    $path = $redirect;
                } elseif (str_starts_with($redirect, 'http://') || str_starts_with($redirect, 'https://')) {
                    $parsedUrl = parse_url($redirect);
                    if (isset($parsedUrl['path'])) {
                        $path = $parsedUrl['path'] . (isset($parsedUrl['query']) ? '?' . $parsedUrl['query'] : '');
                    }
                }
                // Only allow same-origin paths: /b2b/*, /login, / (prevent open redirect)
                if ($path && (str_starts_with($path, '/b2b') || str_starts_with($path, '/login') || $path === '/')) {
                    return redirect($path);
                }
            }

            // For non-B2B registrations, redirect to home instead of dashboard
            return redirect()->route('home');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log validation failures, especially for duplicate email (unique constraint)
            $errors = $e->errors();
            if (isset($errors['email'])) {
                Log::info('Registration validation failed (email)', [
                    'email' => $request->input('email'),
                    'mode' => $request->input('mode') ?: $request->query('mode'),
                    'error' => $errors['email'][0] ?? 'unknown',
                ]);
            }
            // Re-throw validation exceptions so they're handled by Inertia and errors show on form
            throw $e;
        } catch (\Throwable $e) {
            // Check if error is DB duplicate (unique constraint at DB level, not validation level)
            $isDuplicate = str_contains(strtolower($e->getMessage()), 'duplicate') ||
                           str_contains(strtolower($e->getMessage()), 'unique');
            
            Log::error('Registration failed', [
                'email' => $request->input('email'),
                'mode' => $request->input('mode') ?: $request->query('mode'),
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'is_duplicate' => $isDuplicate,
            ]);
            
            // If DB-level duplicate (unique constraint), give clear message
            if ($isDuplicate) {
                return back()->withErrors([
                    'email' => 'This email address is already registered. Please log in instead or use a different email address.',
                ])->withInput($request->only('name', 'email'));
            }
            
            return back()->withErrors([
                'email' => 'An error occurred during registration. Please try again or contact support.',
            ])->withInput($request->only('name', 'email'));
        }
    }
}
