<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Redirect www to non-www (or vice versa) for consistent canonical URLs
 * This ensures Google search results always point to the correct domain
 */
class RedirectWww
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        
        // Check if request is for www subdomain
        if (str_starts_with($host, 'www.')) {
            // Redirect www to non-www (canonical domain)
            $nonWwwHost = substr($host, 4); // Remove 'www.' prefix
            
            // Always use HTTPS for redirect (consistent with production setup)
            $scheme = 'https';
            
            // Preserve query string and path
            $url = $scheme . '://' . $nonWwwHost . $request->getRequestUri();
            
            return redirect($url, 301); // Permanent redirect for SEO
        }
        
        return $next($request);
    }
}
