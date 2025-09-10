<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class B2BPackageAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();

        // Check if user is B2B
        if (!$user->isB2B()) {
            abort(403, 'Access denied. This feature is only available for B2B users.');
        }

        // Check if B2B user is verified
        if (!$user->isVerified()) {
            $status = $user->b2bVerification?->status ?? 'pending';

            if ($status === 'rejected') {
                return redirect()->route('b2b.dashboard')
                    ->with('error', 'Your B2B account has been rejected. Please contact support for assistance.');
            }

            return redirect()->route('b2b.dashboard')
                ->with('warning', 'Your B2B account is pending verification. You cannot access packages until approved.');
        }

        return $next($request);
    }
}
