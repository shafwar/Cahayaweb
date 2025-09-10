<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password page.
     */
    public function show(): Response
    {
        return Inertia::render('auth/confirm-password');
    }

    /**
     * Confirm the user's password.
     */
    public function store(Request $request): RedirectResponse
    {
        if (! Auth::guard('web')->validate([
            'email' => $request->user()->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        $user = Auth::user();

        // Redirect based on user type
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        } elseif ($user->isB2B()) {
            return redirect()->intended(route('b2b.dashboard', absolute: false));
        } else {
            // B2C or other users
            return redirect()->intended(route('user.dashboard', absolute: false));
        }
    }
}
