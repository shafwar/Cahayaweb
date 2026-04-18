<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminEntryController extends Controller
{
    /**
     * /admin — dashboard for admins or login for guests / non-admins.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();

        if ($user) {
            $isAdmin = false;
            if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
                $isAdmin = true;
            }
            if (! $isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
                $isAdmin = true;
            }

            if ($isAdmin) {
                return Inertia::render('admin/dashboard');
            }

            return Inertia::render('auth/login', [
                'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
                'status' => null,
                'mode' => 'admin',
                'redirect' => '/admin',
                'error' => 'You do not have admin access. Please login with an admin account.',
            ]);
        }

        return Inertia::render('auth/login', [
            'canResetPassword' => \Illuminate\Support\Facades\Route::has('password.request'),
            'status' => null,
            'mode' => 'admin',
            'redirect' => '/admin',
        ]);
    }
}
