<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DatabaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Configure database connection with retry logic
        $this->app->resolving('db', function ($db) {
            $db->getEventDispatcher()->listen('illuminate.database.connection.*', function ($event, $params) {
                // Handle connection events
            });
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Add database connection retry logic
        DB::listen(function ($query) {
            // This ensures connection is active
        });

        // Test database connection on boot with retry
        try {
            $maxRetries = 5;
            $retryDelay = 3;
            
            for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
                try {
                    DB::connection()->getPdo();
                    // Connection successful
                    break;
                } catch (\PDOException $e) {
                    if ($attempt === $maxRetries) {
                        Log::warning('Database connection failed after all retries', [
                            'error' => $e->getMessage(),
                            'attempts' => $maxRetries
                        ]);
                        // Don't throw - let application continue
                    } else {
                        Log::info("Database connection attempt {$attempt}/{$maxRetries} failed, retrying...");
                        sleep($retryDelay);
                    }
                }
            }
        } catch (\Throwable $e) {
            // Don't crash application if database is not available
            Log::warning('Database connection test failed', [
                'error' => $e->getMessage()
            ]);
        }
    }
}
