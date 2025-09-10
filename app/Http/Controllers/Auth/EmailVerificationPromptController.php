<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        return $request->user()->hasVerifiedEmail()
                    ? $this->redirectBasedOnUserType($request->user())
                    : Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }

    private function redirectBasedOnUserType($user): RedirectResponse
    {
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        } elseif ($user->isB2B()) {
            return redirect()->intended(route('b2b.dashboard', absolute: false));
        } else {
            return redirect()->intended(route('user.dashboard', absolute: false));
        }
    }
}
