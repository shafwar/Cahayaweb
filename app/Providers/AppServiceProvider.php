<?php

namespace App\Providers;

use App\Support\SectionSnapshot;
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

        SectionSnapshot::restoreIfMissing();
    }
}
