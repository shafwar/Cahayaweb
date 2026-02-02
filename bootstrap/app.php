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
        // CRITICAL: Handle ValidationException FIRST before other handlers
        // This ensures login validation errors are properly converted to Inertia response
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, \Illuminate\Http\Request $request) {
            // For Inertia requests, Laravel automatically converts ValidationException to proper Inertia response
            // But we need to ensure it's handled correctly
            if ($request->header('X-Inertia')) {
                // Return proper Inertia response with validation errors
                // Laravel's default handler will do this, but we ensure it works
                return back()->withErrors($e->errors())->withInput();
            }

            // For AJAX/JSON requests, return JSON with validation errors
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => $e->errors(),
                ], 422);
            }

            // For regular requests, redirect back with errors (Laravel default)
            return redirect()->back()
                ->withInput()
                ->withErrors($e->errors());
        });

        // Handle 419 Page Expired (CSRF Token Mismatch) errors
        $exceptions->render(function (\Illuminate\Session\TokenMismatchException $e, \Illuminate\Http\Request $request) {
            // For Inertia requests, return a clean error response
            if ($request->header('X-Inertia')) {
                // Return JSON response that Inertia can handle
                return response()->json([
                    'message' => 'Your session has expired. Please refresh the page and try again.',
                    'errors' => ['csrf' => 'Session expired. Please refresh the page.'],
                ], 419)->header('X-Inertia-Location', $request->fullUrl());
            }

            // For AJAX requests, return JSON
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'message' => 'Your session has expired. Please refresh the page and try again.',
                    'errors' => ['csrf' => 'Session expired. Please refresh the page.'],
                ], 419);
            }

            // For regular requests, redirect back with error message
            return redirect()->back()
                ->withInput()
                ->withErrors(['csrf' => 'Your session has expired. Please refresh the page and try again.']);
        });

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

        // Handle 500 Internal Server Errors gracefully (but exclude ValidationException and TokenMismatchException)
        // These are already handled above
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            // CRITICAL: Don't handle ValidationException - already handled above
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                return null; // Already handled above
            }

            // CRITICAL: Don't handle TokenMismatchException - already handled above
            if ($e instanceof \Illuminate\Session\TokenMismatchException) {
                return null; // Already handled above
            }

            // Log the error for debugging
            \Log::error('Unhandled exception', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'url' => $request->fullUrl(),
                'exception_type' => get_class($e),
            ]);

            // For Inertia requests, return proper Inertia response (NOT JSON!)
            // CRITICAL: Must use redirect()->withErrors() or redirect()->route(), NOT response()->json()
            if ($request->header('X-Inertia')) {
                if ($request->is('login') || $request->routeIs('login') || str_contains($request->path(), 'login')) {
                    $mode = $request->input('mode') ?: $request->query('mode');
                    $redirect = $request->input('redirect') ?: $request->query('redirect');

                    return redirect()->route('login', array_filter([
                        'mode' => $mode,
                        'redirect' => $redirect,
                    ]))->withErrors([
                        'email' => 'An error occurred during login. Please try again or refresh the page.',
                    ])->withInput($request->only('email'));
                }

                // POST register: keep user in B2B flow; redirect to register with mode/redirect preserved
                if ($request->isMethod('POST') && ($request->routeIs('register') || $request->is('register'))) {
                    $mode = $request->input('mode') ?: $request->query('mode');
                    $redirect = $request->input('redirect') ?: $request->query('redirect');

                    return redirect()->route('register', array_filter([
                        'mode' => $mode,
                        'redirect' => $redirect,
                    ]))->withErrors([
                        'email' => 'An error occurred during registration. Please try again or contact support.',
                    ])->withInput($request->only('name', 'email'));
                }

                // POST b2b/register: redirect back to B2B form
                if ($request->isMethod('POST') && ($request->routeIs('b2b.register.store') || $request->is('b2b/register'))) {
                    return redirect()->route('b2b.register')->withErrors([
                        'message' => 'An error occurred while submitting the form. Please try again.',
                    ])->withInput();
                }

                // For other Inertia requests, redirect to home with error message
                return redirect()->route('home')->with('error', 'An error occurred. Please try again or refresh the page.');
            }

            // For AJAX requests, return JSON
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'message' => 'An error occurred. Please try again or refresh the page.',
                    'errors' => ['server' => 'Server error. Please refresh the page.'],
                ], 500);
            }

            // For regular requests, show error page (Laravel default)
            // Don't expose error details in production
            if (!app()->environment('local')) {
                return response()->view('errors.500', [], 500);
            }
        });
    })->create();
