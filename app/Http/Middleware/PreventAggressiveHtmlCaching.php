<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Stops proxies/CDNs/browsers from caching full HTML documents that embed
 * Vite-hashed script/style URLs. Cached HTML + new deploy = mismatched chunks
 * (white screen, "Cannot read ... Component").
 *
 * Hashed files under /build/assets/* stay cacheable for a long time (see public/.htaccess).
 */
class PreventAggressiveHtmlCaching
{
    /** @var list<string> */
    private const EXCLUDED_PATH_PREFIXES = [
        'up',
        'health',
        'robots.txt',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($response->getStatusCode() !== 200) {
            return $response;
        }

        foreach (self::EXCLUDED_PATH_PREFIXES as $prefix) {
            if ($request->is($prefix)) {
                return $response;
            }
        }

        $contentType = (string) $response->headers->get('Content-Type', '');

        if (! str_contains($contentType, 'text/html')) {
            return $response;
        }

        $response->headers->set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');
        $response->headers->set('Surrogate-Control', 'no-store');

        return $response;
    }
}
