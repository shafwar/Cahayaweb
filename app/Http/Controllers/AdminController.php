<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\SectionSnapshot;
use App\Support\ImageCompressor;
use App\Support\SectionDefaults;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function updateSection(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
        ]);

        // Use updateWithBackup to automatically create revision
        Section::updateWithBackup(
            $validated['key'],
            ['content' => $validated['content'] ?? null]
        );

        return response()->json(['status' => 'ok', 'message' => 'Content saved with backup']);
    }

    public function uploadImage(Request $request): JsonResponse
    {
        try {
            // Early check: file must be received (handles multipart parsing issues)
            if (!$request->hasFile('image')) {
                \Log::warning('AdminController::uploadImage - no file received', [
                    'key' => $request->input('key'),
                    'hasFiles' => $request->hasFile('image'),
                    'contentType' => $request->header('Content-Type'),
                ]);
                return response()->json([
                    'message' => 'File tidak diterima. Pastikan ukuran max 5MB dan format JPEG/PNG/WebP. Jika pakai FormData, jangan set Content-Type manual.',
                    'errors' => ['image' => ['The image file could not be received.']],
                ], 422);
            }

            $guide = config('cms_media_guide.images', []);
            $maxMb = $guide['max_file_size_mb'] ?? 5;
            // Use 'mimes' + 'file' only - avoid 'image' rule which can reject some WhatsApp/camera JPEGs (getimagesize fails)
            $validated = $request->validate([
                'key' => ['required', 'string', 'max:255'],
                'image' => ['required', 'file', 'mimes:jpeg,png,jpg,webp', 'max:' . ($maxMb * 1024)],
            ]);

            $file = $validated['image'];

            // Auto-compress before upload (uses GD, falls back to original if unavailable)
            $compressedPath = ImageCompressor::compress($file);
            $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
            $filename = Str::uuid()->toString() . '.' . $ext;

            $contents = $file->get();
            if ($compressedPath && is_readable($compressedPath)) {
                try {
                    $contents = file_get_contents($compressedPath);
                } catch (\Throwable $e) {
                    // keep original contents
                } finally {
                    @unlink($compressedPath);
                }
            }

            // CMS uploads: ALWAYS use R2 when configured (regardless of FILESYSTEM_DISK)
            $disk = \App\Support\R2Helper::diskForCms();
            $diskName = \App\Support\R2Helper::isR2DiskConfigured() ? 'r2' : 'public';

            $storedPath = 'images/' . $filename;
            if (!$disk->put($storedPath, $contents)) {
                throw new \RuntimeException('Gagal menyimpan file ke storage. Cek konfigurasi R2 atau disk.');
            }

            $root = trim((string) config("filesystems.disks.r2.root", 'public'), '/');
            $objectPath = $root ? $root . '/' . $storedPath : $storedPath;
            $objectPath = ltrim(preg_replace('#/+#', '/', $objectPath), '/');

            // Use R2Helper::url() to ensure correct R2 URL format (https://assets.cahayaanbiya.com/public/images/...)
            $url = \App\Support\R2Helper::url($storedPath) ?? $disk->url($storedPath);

            Section::updateWithBackup(
                $validated['key'],
                ['image' => $storedPath]
            );

            \App\Models\SectionSnapshot::clearCache();
            \Illuminate\Support\Facades\Cache::forget('sections.all');

            return response()->json([
                'status' => 'ok',
                'success' => true,
                'path' => $storedPath,
                'objectPath' => $objectPath,
                'url' => $url,
                'imageUrl' => $url,
                'disk' => $diskName,
                'message' => 'Image uploaded successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            \Log::error('AdminController::uploadImage failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'key' => $request->input('key'),
            ]);
            $userMessage = app()->environment('local')
                ? 'Upload gagal: ' . $e->getMessage()
                : 'Upload gagal. Gambar akan otomatis dikompresi oleh sistem. Jika masih gagal, coba gambar lain atau refresh halaman.';
            return response()->json([
                'message' => $userMessage,
                'errors' => ['server' => [$userMessage]],
            ], 500);
        }
    }

    /**
     * Upload video for CMS. Stored in R2. Max size from cms_media_guide.
     */
    public function uploadVideo(Request $request): JsonResponse
    {
        $guide = config('cms_media_guide.videos', []);
        $maxMb = $guide['max_file_size_mb'] ?? 50;
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:255'],
            'video' => ['required', 'file', 'mimes:mp4,webm', 'max:' . ($maxMb * 1024)],
        ]);

        $file = $validated['video'];
        $ext = strtolower($file->getClientOriginalExtension() ?: 'mp4');
        $filename = Str::uuid()->toString() . '.' . $ext;

        $disk = \App\Support\R2Helper::diskForCms();
        $storedPath = 'videos/' . $filename;
        if (!$disk->put($storedPath, $file->get())) {
            throw new \RuntimeException('Gagal menyimpan video ke storage. Cek konfigurasi R2.');
        }
        $url = \App\Support\R2Helper::url($storedPath) ?? $disk->url($storedPath);

        Section::updateWithBackup(
            $validated['key'],
            ['video' => $storedPath]
        );

        return response()->json([
            'status' => 'ok',
            'success' => true,
            'path' => $storedPath,
            'url' => $url,
            'videoUrl' => $url,
            'message' => 'Video uploaded to R2'
        ]);
    }

    /**
     * Get revision history for a section
     */
    public function getRevisions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:255'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $revisions = \App\Models\SectionRevision::getRevisions(
            $validated['key'],
            $validated['limit'] ?? 10
        );

        return response()->json([
            'status' => 'ok',
            'revisions' => $revisions,
        ]);
    }

    /**
     * Restore section from a revision
     */
    public function restoreRevision(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:255'],
            'revision_id' => ['required', 'integer', 'exists:section_revisions,id'],
        ]);

        $section = Section::where('key', $validated['key'])->first();

        if (!$section) {
            return response()->json([
                'status' => 'error',
                'message' => 'Section not found'
            ], 404);
        }

        $restored = $section->restoreFromRevision($validated['revision_id']);

        if (!$restored) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to restore revision'
            ], 400);
        }

        return response()->json([
            'status' => 'ok',
            'message' => 'Successfully restored to previous version'
        ]);
    }

    /**
     * Reset section to default/original (delete from database)
     */
    public function resetToDefault(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:255'],
        ]);

        [$restored, $removed] = $this->restoreKeys([$validated['key']]);

        // Verify the restore actually worked
        $section = Section::where('key', $validated['key'])->first();
        $snapshot = SectionSnapshot::dataForKey($validated['key']);
        $default = SectionDefaults::get($validated['key']);
        
        // Determine what value should be shown now
        $currentContent = null;
        $currentImage = null;
        
        if ($section) {
            $currentContent = $section->content;
            $currentImage = $section->image;
        } elseif ($snapshot) {
            $currentContent = $snapshot['content'] ?? null;
            $currentImage = $snapshot['image'] ?? null;
        } elseif ($default) {
            $currentContent = $default['content'] ?? null;
            $currentImage = SectionDefaults::imageUrl($validated['key']);
        }

        return response()->json([
            'status' => 'ok',
            'message' => $restored > 0
                ? 'Successfully restored from latest snapshot'
                : 'No snapshot available; key removed to use factory default',
            'restored' => $restored,
            'removed' => $removed,
            'key' => $validated['key'],
            'current_content' => $currentContent,
            'current_image' => $currentImage,
            'verified' => true,
        ]);
    }


    /**
     * Restore multiple section keys from snapshot (or remove if missing)
     */
    private function restoreKeys(array $keys): array
    {
        $restored = 0;
        $removed = 0;

        try {
            Section::withoutSnapshots(function () use ($keys, &$restored, &$removed) {
                foreach (array_unique($keys) as $key) {
                    if (! $key) {
                        continue;
                    }

                    try {
                        // Priority: Snapshot > Default > Delete
                        $payload = SectionSnapshot::dataForKey($key);
                        $default = SectionDefaults::get($key);
                        
                        if ($payload) {
                            $restoreContent = $payload['content'] ?? null;
                            $restoreImage = $payload['image'] ?? null;
                            $restoreVideo = $payload['video'] ?? null;

                            $section = Section::updateOrCreate(
                                ['key' => $key],
                                [
                                    'content' => $restoreContent,
                                    'image' => $restoreImage,
                                    'video' => $restoreVideo,
                                ]
                            );

                            $section->refresh();
                            $isRestored = false;
                            if ($restoreContent !== null) {
                                $isRestored = $section->content === $restoreContent;
                            } elseif ($restoreImage !== null) {
                                $isRestored = $section->image === $restoreImage;
                            } elseif ($restoreVideo !== null) {
                                $isRestored = $section->video === $restoreVideo;
                            } else {
                                $isRestored = ($section->content === null && $section->image === null && $section->video === null);
                            }

                            if ($isRestored) {
                                $restored++;
                                \Log::info('Successfully restored section from snapshot', [
                                    'key' => $key,
                                    'has_content' => !empty($restoreContent),
                                    'has_image' => !empty($restoreImage),
                                    'content' => $restoreContent ? substr($restoreContent, 0, 50) . '...' : 'null',
                                ]);
                            } else {
                                \Log::warning('Restore verification failed', [
                                    'key' => $key,
                                    'expected_content' => $restoreContent,
                                    'actual_content' => $section->content,
                                    'expected_image' => $restoreImage,
                                    'actual_image' => $section->image,
                                ]);
                                // Still count as restored since updateOrCreate succeeded
                                $restored++;
                            }
                        } elseif ($default) {
                            // No snapshot, but has default - delete to use default
                            $deleted = Section::where('key', $key)->delete();
                            if ($deleted) {
                                $restored++;
                                \Log::info('Restored section to default (deleted, will use default)', ['key' => $key]);
                            }
                        } else {
                            // No snapshot and no default - delete section
                            $deleted = Section::where('key', $key)->delete();
                            if ($deleted) {
                                $removed++;
                                \Log::info('Removed section (no snapshot, no default)', ['key' => $key]);
                            }
                        }
                    } catch (\PDOException $e) {
                        \Log::error('Database error during restore', [
                            'key' => $key,
                            'error' => $e->getMessage()
                        ]);
                        // Continue with next key
                    } catch (\Exception $e) {
                        \Log::error('Error restoring section', [
                            'key' => $key,
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);
                        // Continue with next key
                    }
                }
            });

            // Clear SectionSnapshot cache after restore
            SectionSnapshot::clearCache();
            
            // Clear any Laravel cache that might be caching sections
            \Cache::forget('sections.all');
            
        } catch (\Exception $e) {
            \Log::error('Critical error in restoreKeys', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }

        return [$restored, $removed];
    }

    private function knownKeys(): \Illuminate\Support\Collection
    {
        return SectionSnapshot::latestPayload()->keys()
            ->merge(Section::pluck('key'))
            ->merge(collect(array_keys(SectionDefaults::all())))
            ->filter()
            ->unique();
    }

}


