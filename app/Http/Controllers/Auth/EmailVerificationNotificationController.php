<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
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

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
