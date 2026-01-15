<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            event(new Registered($user));

            Auth::login($user);

            // Regenerate session token after successful registration
            $request->session()->regenerateToken();

            // PRIORITY 1: Check if there's stored B2B registration data in session (most reliable)
            if ($request->session()->has('b2b_registration_data')) {
                return redirect()->route('b2b.register.store.continue');
            }

            // PRIORITY 2: Check mode parameter for B2B
            $mode = $request->input('mode');
            if ($mode === 'b2b') {
                // If mode is b2b, always redirect to continue registration
                return redirect()->route('b2b.register.store.continue');
            }

            // PRIORITY 3: Check if there's a redirect parameter (e.g., from B2B registration)
            $redirect = $request->input('redirect');
            if ($redirect) {
                // Handle both relative and absolute URLs
                if (str_starts_with($redirect, '/')) {
                    // Relative URL - use directly
                    return redirect($redirect);
                } elseif (str_starts_with($redirect, 'http://') || str_starts_with($redirect, 'https://')) {
                    // Absolute URL - extract path and use it
                    $parsedUrl = parse_url($redirect);
                    if (isset($parsedUrl['path'])) {
                        return redirect($parsedUrl['path'] . (isset($parsedUrl['query']) ? '?' . $parsedUrl['query'] : ''));
                    }
                }
            }

            // For non-B2B registrations, redirect to home instead of dashboard
            return redirect()->route('home');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Re-throw validation exceptions so they're handled by Inertia
            throw $e;
        } catch (\Exception $e) {
            // Handle other exceptions
            return back()->withErrors([
                'email' => 'An error occurred during registration. Please try again.',
            ])->withInput($request->only('name', 'email'));
        }
    }
}
