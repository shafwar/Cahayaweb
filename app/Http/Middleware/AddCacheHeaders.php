<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Add HTTP cache headers for better performance
 * Only adds cache headers for static assets and safe responses
 */
class AddCacheHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $response = $next($request);
        } catch (\Throwable $e) {
            // If there's an error, let it propagate (don't catch here)
            throw $e;
        }

        // Safety check: ensure response is valid
        if (!$response instanceof Response) {
            return $response;
        }

        // Don't cache if response has no-cache headers already set
        try {
            if ($response->headers->has('Cache-Control') && 
                str_contains($response->headers->get('Cache-Control', ''), 'no-cache')) {
                return $response;
            }
        } catch (\Throwable $e) {
            // If header check fails, continue without modifying headers
            \Log::warning('Cache header check failed', ['error' => $e->getMessage()]);
            return $response;
        }

        try {
            $path = $request->path();
            $contentType = $response->headers->get('Content-Type', '');
        } catch (\Throwable $e) {
            // If path/contentType check fails, return response as-is
            \Log::warning('Path/contentType check failed', ['error' => $e->getMessage()]);
            return $response;
        }

        // Static assets - long cache (1 year) with versioning
        if (str_starts_with($path, 'build/') || 
            str_starts_with($path, 'images/') ||
            str_starts_with($path, 'videos/') ||
            preg_match('/\.(js|css|jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot)$/i', $path)) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
            $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
            return $response;
        }

        // HTML responses - short cache (5 minutes) for Inertia pages
        if (str_contains($contentType, 'text/html')) {
            // Don't cache HTML responses that require authentication
            try {
                if ($request->user()) {
                    $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
                    $response->headers->set('Pragma', 'no-cache');
                    $response->headers->set('Expires', '0');
                } else {
                    // Public pages - short cache
                    $response->headers->set('Cache-Control', 'public, max-age=300, must-revalidate');
                    $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + 300) . ' GMT');
                }
            } catch (\Throwable $e) {
                // If user() check fails, default to no-cache for safety
                $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
                $response->headers->set('Pragma', 'no-cache');
                $response->headers->set('Expires', '0');
            }
            return $response;
        }

        // JSON responses (API) - no cache by default
        if (str_contains($contentType, 'application/json')) {
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
            $response->headers->set('Pragma', 'no-cache');
            $response->headers->set('Expires', '0');
            return $response;
        }

        return $response;
    }
}
