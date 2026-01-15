<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            // Check if user has B2B access
            if ($user->hasB2BAccess()) {
                return redirect()->intended(route('b2b.index', absolute: false).'?verified=1');
            }
            return redirect()->intended(route('home', absolute: false).'?verified=1');
        }

        $request->fulfill();

        // Check if user has B2B access
        if ($user->hasB2BAccess()) {
            return redirect()->intended(route('b2b.index', absolute: false).'?verified=1');
        }
        return redirect()->intended(route('home', absolute: false).'?verified=1');
    }
}
