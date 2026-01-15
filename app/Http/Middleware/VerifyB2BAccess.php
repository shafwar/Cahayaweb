<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class VerifyB2BAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is not authenticated, redirect to registration form (no login required)
        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'B2B access requires agent registration',
                    'status' => 'unverified',
                    'redirect' => route('b2b.register')
                ], 403);
            }
            return redirect()->route('b2b.register');
        }

        // Check if user is admin - admins can bypass B2B verification
        $isAdmin = false;
        if (method_exists($user, 'getAttribute') && $user->getAttribute('role') === 'admin') {
            $isAdmin = true;
        }
        if (!$isAdmin && in_array($user->email, config('app.admin_emails', []), true)) {
            $isAdmin = true;
        }

        // If user is admin, allow direct access to B2B portal
        if ($isAdmin) {
            return $next($request);
        }

        // Check if user has B2B access
        if (!$user->hasB2BAccess()) {
            // If user has pending verification, show pending page
            if ($user->hasPendingB2BVerification()) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Your B2B access is pending approval',
                        'status' => 'pending'
                    ], 403);
                }
                return redirect()->route('b2b.pending');
            }

            // If no verification exists or rejected, show registration form
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'B2B access requires verification',
                    'status' => 'unverified'
                ], 403);
            }
            return redirect()->route('b2b.register');
        }

        return $next($request);
    }
}
