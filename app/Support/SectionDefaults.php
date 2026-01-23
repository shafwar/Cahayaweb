<?php

namespace App\Support;

use Illuminate\Support\Arr;
use App\Support\R2Helper;

class SectionDefaults
{
    public static function all(): array
    {
        return config('sections.defaults', []);
    }

    public static function get(string $key): ?array
    {
        $defaults = static::all();
        return $defaults[$key] ?? null;
    }

    public static function has(string $key): bool
    {
        return static::get($key) !== null;
    }

    public static function content(string $key): ?string
    {
        $default = static::get($key);
        return $default['content'] ?? null;
    }

    public static function imageUrl(string $key): ?string
    {
        try {
            $default = static::get($key);
            $path = Arr::get($default, 'public_path');

            if (! $path || (Arr::get($default, 'type') !== 'image')) {
                return null;
            }

            // Try to get image from R2 first
            // If path is like '/arabsaudi.jpg', convert to 'images/arabsaudi.jpg' for R2
            $r2Path = ltrim($path, '/');
            
            // Check if it's already in images/ folder format
            if (!str_starts_with($r2Path, 'images/') && !str_starts_with($r2Path, 'videos/')) {
                // Assume it's an image in the public root, check if exists in R2 images folder
                $r2ImagePath = 'images/' . $r2Path;
                try {
                    $r2Url = R2Helper::url($r2ImagePath);
                    if ($r2Url) {
                        return $r2Url;
                    }
                } catch (\Exception $e) {
                    \Log::warning('Error getting R2 URL for default image', [
                        'key' => $key,
                        'path' => $r2ImagePath,
                        'error' => $e->getMessage()
                    ]);
                }
            } else {
                try {
                    $r2Url = R2Helper::url($r2Path);
                    if ($r2Url) {
                        return $r2Url;
                    }
                } catch (\Exception $e) {
                    \Log::warning('Error getting R2 URL for default image', [
                        'key' => $key,
                        'path' => $r2Path,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            // Fallback to local asset if R2 not available
            return asset($path);
        } catch (\Exception $e) {
            \Log::warning('Error in SectionDefaults::imageUrl', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            // Return null on error to prevent breaking the page
            return null;
        }
    }
}

