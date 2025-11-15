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
        // Register is_admin middleware alias
        \Illuminate\Support\Facades\Route::aliasMiddleware('is_admin', \App\Http\Middleware\IsAdmin::class);

        if (Schema::hasTable('section_snapshots') && Section::count() === 0) {
            SectionSnapshot::latestPayload()->each(function (array $row) {
                Section::updateOrCreate(['key' => $row['key']], [
                    'content' => $row['content'] ?? null,
                    'image' => $row['image'] ?? null,
                ]);
            });
        }
    }
}
