<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\File;

class ViteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Ensure manifest.json exists and is accessible
        $manifestPath = public_path('build/manifest.json');
        $viteManifestPath = public_path('build/.vite/manifest.json');
        
        // If manifest.json doesn't exist but .vite/manifest.json does, copy it
        if (!File::exists($manifestPath) && File::exists($viteManifestPath)) {
            try {
                File::copy($viteManifestPath, $manifestPath);
            } catch (\Throwable $e) {
                \Log::warning('Failed to copy Vite manifest', [
                    'error' => $e->getMessage()
                ]);
            }
        }
    }
}
