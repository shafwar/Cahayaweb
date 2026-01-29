<?php

namespace App\Providers;

use App\Models\Section;
use App\Models\SectionSnapshot;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS for all generated URLs in production (prevents Mixed Content when frontend loads over HTTPS)
        if (app()->environment('production') || config('app.force_https', false)) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // Register is_admin middleware alias
        \Illuminate\Support\Facades\Route::aliasMiddleware('is_admin', \App\Http\Middleware\IsAdmin::class);

        // Restore sections from snapshot if database is empty
        // Wrap in try-catch to prevent crashes if database isn't ready
        try {
            // Check if database connection is available
            \Illuminate\Support\Facades\DB::connection()->getPdo();

            // Only proceed if we can connect to database
            if (Schema::hasTable('sections') && Schema::hasTable('section_snapshots')) {
                $sectionCount = Section::count();

                // Only restore if sections table is empty
                if ($sectionCount === 0) {
                    $snapshot = SectionSnapshot::latestPayload();

                    if ($snapshot->isNotEmpty()) {
                        \Log::info('Restoring sections from snapshot', [
                            'snapshot_count' => $snapshot->count()
                        ]);

                        $restored = 0;
                        $snapshot->each(function (array $row) use (&$restored) {
                            try {
                                Section::updateOrCreate(
                                    ['key' => $row['key'] ?? null],
                                    [
                                        'content' => $row['content'] ?? null,
                                        'image' => $row['image'] ?? null,
                                    ]
                                );
                                $restored++;
                            } catch (\Exception $e) {
                                \Log::warning('Failed to restore section from snapshot', [
                                    'key' => $row['key'] ?? 'unknown',
                                    'error' => $e->getMessage()
                                ]);
                            }
                        });

                        \Log::info('Sections restored from snapshot', [
                            'restored_count' => $restored,
                            'total_snapshots' => $snapshot->count()
                        ]);
                    }
                }
            }
        } catch (\PDOException $e) {
            // Database connection not available yet - this is OK during startup
            \Log::debug('Database not ready for restore check', [
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            // Any other error - log but don't crash
            \Log::warning('Error during section restore check', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}
