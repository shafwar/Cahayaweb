<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Compress responses with gzip/brotli for better performance
 */
class CompressResponse
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only compress text-based responses
        $contentType = $response->headers->get('Content-Type', '');
        $shouldCompress = str_contains($contentType, 'text/html') ||
                         str_contains($contentType, 'text/css') ||
                         str_contains($contentType, 'text/javascript') ||
                         str_contains($contentType, 'application/javascript') ||
                         str_contains($contentType, 'application/json') ||
                         str_contains($contentType, 'text/xml') ||
                         str_contains($contentType, 'application/xml');

        if (!$shouldCompress) {
            return $response;
        }

        // Check if client supports compression
        $acceptEncoding = $request->header('Accept-Encoding', '');
        
        // Brotli compression (better compression ratio)
        if (str_contains($acceptEncoding, 'br') && function_exists('brotli_compress')) {
            $content = $response->getContent();
            if ($content !== false) {
                $compressed = @brotli_compress($content, 4); // Level 4 for balance
                if ($compressed !== false && strlen($compressed) < strlen($content)) {
                    $response->setContent($compressed);
                    $response->headers->set('Content-Encoding', 'br');
                    $response->headers->set('Vary', 'Accept-Encoding');
                }
            }
        }
        // Gzip compression (fallback)
        elseif (str_contains($acceptEncoding, 'gzip') && function_exists('gzencode')) {
            $content = $response->getContent();
            if ($content !== false) {
                $compressed = @gzencode($content, 6); // Level 6 for balance
                if ($compressed !== false && strlen($compressed) < strlen($content)) {
                    $response->setContent($compressed);
                    $response->headers->set('Content-Encoding', 'gzip');
                    $response->headers->set('Vary', 'Accept-Encoding');
                }
            }
        }

        return $response;
    }
}
