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
            return $this->redirectBasedOnUserType($user, '?verified=1');
        }

        $request->fulfill();

        return $this->redirectBasedOnUserType($user, '?verified=1');
    }

    private function redirectBasedOnUserType($user, $query = ''): RedirectResponse
    {
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false).$query);
        } elseif ($user->isB2B()) {
            return redirect()->intended(route('b2b.dashboard', absolute: false).$query);
        } else {
            return redirect()->intended(route('user.dashboard', absolute: false).$query);
        }
    }
}
