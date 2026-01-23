<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class R2Helper
{
    /**
     * Get the R2 disk instance
     */
    public static function disk()
    {
        try {
            $diskName = config('filesystems.default', 'r2');
            
            // Check if disk exists in config
            if (!config("filesystems.disks.{$diskName}")) {
                // Fallback to 'public' disk if r2 not configured
                return Storage::disk('public');
            }
            
            return Storage::disk($diskName);
        } catch (\Exception $e) {
            // Fallback to public disk on any error
            Log::warning('Failed to get R2 disk, using public disk', [
                'error' => $e->getMessage()
            ]);
            return Storage::disk('public');
        }
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

        try {
            $diskName = config('filesystems.default', 'r2');
            
            // Check if disk exists in config
            $diskConfig = config("filesystems.disks.{$diskName}");
            
            // If using R2/S3 disk and config exists, generate URL from R2
            if (($diskName === 'r2' || $diskName === 's3') && $diskConfig) {
                // Get base URL from config
                $baseUrl = $diskConfig['url'] ?? null;
                
                if (!$baseUrl) {
                    // Fallback to local storage if R2 URL not configured
                    return asset('storage/' . $path);
                }
                
                // Clean the path (remove leading/trailing slashes)
                $cleanPath = trim($path, '/');
                
                // Get root folder from config (default: 'public')
                $root = trim($diskConfig['root'] ?? 'public', '/');
                
                // IMPORTANT: R2 custom domain path construction
                // Files in R2 are stored at: bucket/public/images/file.jpg (if root='public')
                // Path stored in DB: 'images/file.jpg' (relative to root)
                // 
                // R2 custom domain typically points to bucket root, so:
                // - File location: bucket/public/images/file.jpg
                // - URL should be: customDomain/public/images/file.jpg
                //
                // Build the full path including root
                if ($root && str_starts_with($cleanPath, $root . '/')) {
                    // Path already includes root: 'public/images/file.jpg'
                    $fullPath = $cleanPath;
                } elseif ($root && !str_starts_with($cleanPath, $root . '/')) {
                    // Path doesn't include root: 'images/file.jpg' -> 'public/images/file.jpg'
                    $fullPath = $root . '/' . $cleanPath;
                } else {
                    // No root configured
                    $fullPath = $cleanPath;
                }
                
                $url = rtrim($baseUrl, '/') . '/' . ltrim($fullPath, '/');
                
                return $url;
            }
        } catch (\Exception $e) {
            Log::warning('Failed to generate R2 URL', [
                'path' => $path,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        } catch (\Throwable $e) {
            Log::error('Fatal error generating R2 URL', [
                'path' => $path,
                'error' => $e->getMessage()
            ]);
        }

        // Fallback to local storage on any error
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
