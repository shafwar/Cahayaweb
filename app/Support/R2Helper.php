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
     * @param string|null $path Path relative to R2 root (e.g., 'images/filename.jpg' or 'public/images/filename.jpg')
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

            // Get base URL and root from config
            $baseUrl = $diskConfig['url'] ?? 'https://assets.cahayaanbiya.com';
            $root = trim($diskConfig['root'] ?? 'public', '/');

            // Clean the path (remove leading/trailing slashes)
            $cleanPath = trim($path, '/');

            // CRITICAL FIX: Remove root prefix if it's already in the path
            // Files are stored at: public/images/file.jpg
            // If path is 'public/images/file.jpg', we should use it as-is
            // If path is 'images/file.jpg', we should add 'public/' prefix
            if ($root && str_starts_with($cleanPath, $root . '/')) {
                // Path already includes root: 'public/images/file.jpg'
                // Use it directly without adding root again
                $fullPath = $cleanPath;
            } elseif ($root && !str_starts_with($cleanPath, $root . '/')) {
                // Path doesn't include root: 'images/file.jpg' -> 'public/images/file.jpg'
                $fullPath = $root . '/' . $cleanPath;
            } else {
                // No root configured or path doesn't need root
                $fullPath = $cleanPath;
            }

            // Construct the final URL
            $url = rtrim($baseUrl, '/') . '/' . ltrim($fullPath, '/');

            return $url;

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

            // Remove 'public/' prefix if present to avoid duplication
            if (str_starts_with($cleanPath, 'public/')) {
                $cleanPath = substr($cleanPath, 7); // Remove 'public/'
            }

            // Build R2 URL structure
            // Handle B2B documents (in public/documents/agent-verifications/ in bucket)
            if (str_starts_with($cleanPath, 'documents/agent-verifications/') || str_starts_with($cleanPath, 'agent-verifications/')) {
                return $r2BaseUrl . '/public/' . $cleanPath;
            }

            // Handle images, videos, and packages folders
            if (str_starts_with($cleanPath, 'images/') || str_starts_with($cleanPath, 'videos/') || str_starts_with($cleanPath, 'packages/')) {
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

            // For PDF and other documents, check if it's in agent-verifications
            $documentExtensions = ['.pdf', '.doc', '.docx'];
            $isDocument = false;
            foreach ($documentExtensions as $ext) {
                if (str_ends_with(strtolower($cleanPath), $ext)) {
                    $isDocument = true;
                    break;
                }
            }

            // If it's a document and path contains agent-verifications, use documents/agent-verifications folder
            if ($isDocument && str_contains($cleanPath, 'agent-verification')) {
                return $r2BaseUrl . '/public/documents/agent-verifications/' . basename($cleanPath);
            }

            if (str_starts_with($cleanPath, 'packages/')) {
                return $r2BaseUrl . '/public/' . $cleanPath;
            }

            return $r2BaseUrl . '/public/images/' . $cleanPath;
        } catch (\Throwable $e) {
            Log::error('Failed to generate R2 URL even in fallback', [
                'path' => $path,
                'error' => $e->getMessage()
            ]);
            // Last resort: return R2 URL structure anyway
            $cleanPath = trim($path, '/');
            if (str_starts_with($cleanPath, 'public/')) {
                $cleanPath = substr($cleanPath, 7);
            }

            // Check if it's an agent-verification file (B2B documents in documents/agent-verifications)
            if (str_contains($cleanPath, 'agent-verification')) {
                return 'https://assets.cahayaanbiya.com/public/documents/agent-verifications/' . basename($cleanPath);
            }

            return 'https://assets.cahayaanbiya.com/public/images/' . $cleanPath;
        }
    }

    /**
     * Check if R2 disk is configured (has credentials, bucket, and endpoint).
     * Use this for agent-verification uploads/downloads so they use R2 even when default disk is 'local'.
     * Endpoint is required for Cloudflare R2 (custom S3-compatible endpoint).
     */
    public static function isR2DiskConfigured(): bool
    {
        $config = config('filesystems.disks.r2');
        if (!$config || ($config['driver'] ?? '') !== 's3') {
            return false;
        }
        return !empty($config['key'])
            && !empty($config['secret'])
            && !empty($config['bucket'])
            && !empty($config['url'])
            && !empty($config['endpoint']);
    }

    /**
     * Check if R2 is configured and available (default disk is r2/s3 and has credentials).
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
