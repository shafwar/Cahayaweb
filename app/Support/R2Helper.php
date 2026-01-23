<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class R2Helper
{
    /**
     * Get the R2 disk instance
     */
    public static function disk()
    {
        $diskName = config('filesystems.default', 'r2');
        return Storage::disk($diskName);
    }

    /**
     * Generate R2 URL for a given path
     * 
     * @param string|null $path Path relative to R2 root (e.g., 'images/filename.jpg')
     * @return string|null Full R2 URL or null if path is empty
     */
    public static function url(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        $diskName = config('filesystems.default', 'r2');
        
        // If using R2 disk, generate URL from R2
        if ($diskName === 'r2' || $diskName === 's3') {
            try {
                $disk = self::disk();
                $config = config("filesystems.disks.{$diskName}");
                
                // Get base URL from config
                $baseUrl = $config['url'] ?? null;
                
                if (!$baseUrl) {
                    // Fallback to local storage if R2 URL not configured
                    return asset('storage/' . $path);
                }
                
                // Clean the path (remove leading/trailing slashes)
                $cleanPath = trim($path, '/');
                
                // Get root folder from config (default: 'public')
                $root = trim($config['root'] ?? 'public', '/');
                
                // Build full URL: baseUrl/root/path
                // Example: https://assets.cahayaanbiya.id/public/images/filename.jpg
                if ($root && !str_starts_with($cleanPath, $root . '/')) {
                    $fullPath = $root . '/' . $cleanPath;
                } else {
                    $fullPath = $cleanPath;
                }
                
                $url = rtrim($baseUrl, '/') . '/' . ltrim($fullPath, '/');
                
                return $url;
            } catch (\Exception $e) {
                \Log::warning('Failed to generate R2 URL', [
                    'path' => $path,
                    'error' => $e->getMessage()
                ]);
                // Fallback to local storage on error
                return asset('storage/' . $path);
            }
        }

        // Fallback to local storage
        return asset('storage/' . $path);
    }

    /**
     * Check if R2 is configured and available
     */
    public static function isConfigured(): bool
    {
        $diskName = config('filesystems.default', 'r2');
        
        if ($diskName !== 'r2' && $diskName !== 's3') {
            return false;
        }

        $config = config("filesystems.disks.{$diskName}");
        
        return !empty($config['key']) 
            && !empty($config['secret']) 
            && !empty($config['bucket'])
            && !empty($config['url']);
    }

    /**
     * Get R2 base URL
     */
    public static function baseUrl(): ?string
    {
        $diskName = config('filesystems.default', 'r2');
        return config("filesystems.disks.{$diskName}.url");
    }
}
