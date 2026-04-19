<?php

namespace App\Support;

use App\Models\AgentVerification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Deletes B2B verification documents from R2 and/or public disk using the same path rules as downloads.
 * Called automatically when an AgentVerification model is deleted (observer).
 */
class AgentVerificationFileCleanup
{
    private const B2B_PREFIX = 'documents/agent-verifications';

    public static function purgeStorageFor(AgentVerification $verification): void
    {
        $verificationId = (int) $verification->id;
        $userId = $verification->user_id ? (int) $verification->user_id : null;

        foreach (['business_license_file', 'tax_certificate_file', 'company_profile_file'] as $field) {
            $path = $verification->getAttribute($field);
            if (empty($path)) {
                continue;
            }
            self::deleteOnePathOnDisks((string) $path, $verificationId, $field);
        }

        if ($userId !== null && $verificationId > 0) {
            self::deleteDirectoryIfExists(self::B2B_PREFIX.'/'.$userId.'/'.$verificationId);
        }
    }

    /**
     * Match path variants used by admin download (R2 vs public, optional public/ prefix).
     */
    private static function pathVariants(string $filePath): array
    {
        $filePath = ltrim($filePath, '/');

        return array_values(array_unique(array_filter([
            $filePath,
            ltrim(str_replace('public/', '', $filePath), '/'),
            'public/'.ltrim($filePath, '/'),
        ])));
    }

    private static function deleteOnePathOnDisks(string $storedPath, int $verificationId, string $field): void
    {
        $variants = self::pathVariants($storedPath);
        $removed = false;

        if (R2Helper::isR2DiskConfigured()) {
            try {
                $disk = Storage::disk('r2');
                foreach ($variants as $p) {
                    try {
                        if ($disk->exists($p)) {
                            $disk->delete($p);
                            $removed = true;
                            Log::info('Agent verification file removed from R2', [
                                'verification_id' => $verificationId,
                                'field' => $field,
                                'path' => $p,
                            ]);
                            break;
                        }
                    } catch (\Throwable $e) {
                        Log::debug('R2 delete attempt failed', ['path' => $p, 'error' => $e->getMessage()]);
                    }
                }
            } catch (\Throwable $e) {
                Log::warning('R2 disk unavailable during verification file cleanup', [
                    'verification_id' => $verificationId,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        try {
            $public = Storage::disk('public');
            foreach ($variants as $p) {
                try {
                    if ($public->exists($p)) {
                        $public->delete($p);
                        if (! $removed) {
                            Log::info('Agent verification file removed from public disk', [
                                'verification_id' => $verificationId,
                                'field' => $field,
                                'path' => $p,
                            ]);
                        }
                    }
                } catch (\Throwable $e) {
                    Log::debug('Public disk delete attempt failed', ['path' => $p, 'error' => $e->getMessage()]);
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Public disk unavailable during verification file cleanup', [
                'verification_id' => $verificationId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private static function deleteDirectoryIfExists(string $relativeDir): void
    {
        $relativeDir = trim($relativeDir, '/');
        foreach (['r2', 'public'] as $diskName) {
            if ($diskName === 'r2' && ! R2Helper::isR2DiskConfigured()) {
                continue;
            }
            try {
                $disk = Storage::disk($diskName);
                if ($disk->exists($relativeDir)) {
                    $disk->deleteDirectory($relativeDir);
                    Log::info('Agent verification folder removed', ['disk' => $diskName, 'path' => $relativeDir]);
                }
            } catch (\Throwable $e) {
                Log::debug('Verification folder delete skipped or failed', [
                    'disk' => $diskName,
                    'path' => $relativeDir,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
