<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state', 'XSRF-TOKEN']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'verify.b2b' => \App\Http\Middleware\VerifyB2BAccess::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle 413 Content Too Large errors with professional message
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpException $e, \Illuminate\Http\Request $request) {
            if ($e->getStatusCode() === 413) {
                // Check if this is an Inertia request
                if ($request->header('X-Inertia')) {
                    return \Inertia\Inertia::render('errors/413', [
                        'status' => 413,
                        'message' => 'File Upload Size Limit Exceeded',
                        'details' => 'The total size of your uploaded files exceeds the server\'s maximum limit. Please ensure each file is no larger than 5MB and the total combined size does not exceed 15MB.',
                    ])->toResponse($request)->setStatusCode(413);
                }
                
                // For non-Inertia requests, return JSON or redirect
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'File Upload Size Limit Exceeded',
                        'error' => 'The total size of your uploaded files exceeds the server\'s maximum limit. Please ensure each file is no larger than 5MB and the total combined size does not exceed 15MB.',
                        'status' => 413,
                    ], 413);
                }
                
                return redirect()->back()->withErrors([
                    'file_size' => 'File Upload Size Limit Exceeded. The total size of your uploaded files exceeds the server\'s maximum limit. Please ensure each file is no larger than 5MB and the total combined size does not exceed 15MB.',
                ])->withInput();
            }
        });
    })->create();
