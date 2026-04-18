<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class SystemDiagnosticsController extends Controller
{
    public function debug(): JsonResponse
    {
        return response()->json([
            'status' => 'Laravel is running',
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'environment' => app()->environment(),
            'database_path' => config('database.connections.sqlite.database'),
            'database_exists' => file_exists(config('database.connections.sqlite.database')),
            'storage_writable' => is_writable(storage_path()),
            'cache_path' => storage_path('framework/cache'),
            'session_path' => storage_path('framework/sessions'),
            'views_path' => storage_path('framework/views'),
        ]);
    }

    public function health(): JsonResponse
    {
        return response()->json([
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'port' => $_ENV['PORT'] ?? '8000',
        ]);
    }
}
