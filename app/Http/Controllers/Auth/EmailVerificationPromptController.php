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
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            // Check if user has B2B access
            if ($user->hasB2BAccess()) {
                return redirect()->intended(route('b2b.index', absolute: false));
            }
            return redirect()->intended(route('home', absolute: false));
        }

        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
