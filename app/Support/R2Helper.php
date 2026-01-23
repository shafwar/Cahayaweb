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
                    // R2 URL not configured - still return R2 URL structure, don't fallback to local
                    // This ensures we always try R2 first
                    $r2BaseUrl = 'https://assets.cahayaanbiya.com';
                    $cleanPath = trim($path, '/');
                    $root = 'public';
                    
                    // Build R2 URL structure
                    if (str_starts_with($cleanPath, 'images/') || str_starts_with($cleanPath, 'videos/')) {
                        return $r2BaseUrl . '/public/' . $cleanPath;
                    }
                    
                    // Determine if it's a video or image
                    $videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
                    $isVideo = false;
                    foreach ($videoExtensions as $ext) {
                        if (str_ends_with(strtolower($cleanPath), $ext)) {
                            $isVideo = true;
                            break;
                        }
                    }
                    
                    if ($isVideo) {
                        return $r2BaseUrl . '/public/videos/' . $cleanPath;
                    }
                    
                    return $r2BaseUrl . '/public/images/' . $cleanPath;
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
                
                // Return the URL - browser will handle 404 if file doesn't exist
                // We can't check file existence here without making HTTP requests
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

        // On error, still return R2 URL structure, don't fallback to local
        // This ensures we always try R2 first
        try {
            $r2BaseUrl = 'https://assets.cahayaanbiya.com';
            $cleanPath = trim($path, '/');
            $root = 'public';
            
            // Build R2 URL structure
            if (str_starts_with($cleanPath, 'images/') || str_starts_with($cleanPath, 'videos/')) {
                return $r2BaseUrl . '/public/' . $cleanPath;
            }
            
            // Determine if it's a video or image
            $videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
            $isVideo = false;
            foreach ($videoExtensions as $ext) {
                if (str_ends_with(strtolower($cleanPath), $ext)) {
                    $isVideo = true;
                    break;
                }
            }
            
            if ($isVideo) {
                return $r2BaseUrl . '/public/videos/' . $cleanPath;
            }
            
            return $r2BaseUrl . '/public/images/' . $cleanPath;
        } catch (\Throwable $e) {
            Log::error('Failed to generate R2 URL even in fallback', [
                'path' => $path,
                'error' => $e->getMessage()
            ]);
            // Last resort: return R2 URL structure anyway
            return 'https://assets.cahayaanbiya.com/public/images/' . trim($path, '/');
        }
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
