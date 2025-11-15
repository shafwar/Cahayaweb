<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): \Inertia\Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'mode' => $request->query('mode'),
            'redirect' => $request->query('redirect'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): Response
    {
        $request->authenticate();

        $request->session()->regenerate();

        $redirectTarget = $this->determineRedirectTarget($request);

        // Inertia form submissions expect a location response instead of a plain redirect
        if ($request->header('X-Inertia')) {
            return Inertia::location($redirectTarget);
        }

        return redirect()->intended($redirectTarget);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    protected function determineRedirectTarget(Request $request): string
    {
        $redirect = $request->input('redirect');

        if (is_string($redirect) && str_starts_with($redirect, '/')) {
            return $redirect;
        }

        $mode = $request->input('mode');
        if ($mode === 'b2b') {
            return route('b2b.index', absolute: false);
        }
        if ($mode === 'b2c') {
            return route('b2c.home', absolute: false);
        }

        return route('dashboard', absolute: false);
    }
}
