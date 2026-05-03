<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Legacy /dashboard URL: no standalone user dashboard — send visitors somewhere useful.
 */
class DashboardController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user !== null && $user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        return redirect()->intended(route('home', absolute: false));
    }
}
