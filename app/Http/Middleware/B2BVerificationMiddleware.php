<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class B2BVerificationMiddleware
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

        // Allow B2B users to access dashboard even if not verified
        // Only block access to packages and other restricted features
        if ($user->isB2B() && !$user->isVerified()) {
            $allowedRoutes = [
                'b2b.dashboard',
                'b2b.verification.required',
                'b2b.verification.form',
                'b2b.verification.submit',
                'b2b.verification.status',
                'logout'
            ];

            if (!in_array($request->route()->getName(), $allowedRoutes)) {
                return redirect()->route('b2b.dashboard')
                    ->with('warning', 'Your B2B account requires verification before accessing this feature.');
            }
        }

        return $next($request);
    }
}
