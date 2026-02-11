<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $e
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $e)
    {
        // Handle ViteManifestNotFoundException gracefully
        if ($e instanceof \Illuminate\Foundation\ViteManifestNotFoundException) {
            Log::error('ViteManifestNotFoundException: ' . $e->getMessage(), [
                'path' => $e->getPath() ?? 'unknown',
                'url' => $request->fullUrl(),
            ]);

            // Return a response that includes fallback UI
            return response()->view('errors.vite-manifest', [
                'message' => 'Build assets are missing. Please rebuild and deploy assets.',
            ], 500);
        }

        return parent::render($request, $e);
    }
}
