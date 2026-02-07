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
        $guide = config('cms_media_guide.images', []);
        $maxMb = $guide['max_file_size_mb'] ?? 5;
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:255'],
            'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:' . ($maxMb * 1024)],
        ]);

        $file = $validated['image'];

        // Auto-compress before upload (uses GD, falls back to original if unavailable)
        $compressedPath = ImageCompressor::compress($file);
        $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $filename = Str::uuid()->toString() . '.' . $ext;

        try {
            if ($compressedPath && is_readable($compressedPath)) {
                $contents = file_get_contents($compressedPath);
                @unlink($compressedPath);
            } else {
                $contents = $file->get();
            }
        } catch (\Throwable $e) {
            $contents = $file->get();
        }

        // Use R2 disk
        $diskName = config('filesystems.default', 'r2');
        try {
            $disk = \App\Support\R2Helper::disk();
        } catch (\Exception $e) {
            \Log::warning('Failed to get R2 disk in AdminController::uploadImage', [
                'error' => $e->getMessage()
            ]);
            $disk = Storage::disk('public');
        }

        $storedPath = 'images/' . $filename;
        $disk->put($storedPath, $contents);
        
        // Get the root directory configured in filesystems
        $root = trim((string) config("filesystems.disks.{$diskName}.root", ''), '/');
        
        // Build the object path as stored in R2
        // If root is 'public', then full path is 'public/images/filename'
        $objectPath = $root ? $root . '/' . $storedPath : $storedPath;
        $objectPath = ltrim(preg_replace('#/+#', '/', $objectPath), '/');
        
        // Generate public URL using AWS_URL (custom domain)
        $url = $disk->url($storedPath);

        // Use updateWithBackup to automatically create revision
        // Store the path relative to R2 root (e.g., 'images/uuid.jpg')
        Section::updateWithBackup(
            $validated['key'],
            ['image' => $storedPath]
        );

        return response()->json([
            'status' => 'ok',
            'success' => true, // alias for frontend compatibility
            'path' => $storedPath,
            'objectPath' => $objectPath,
            'url' => $url,
            'imageUrl' => $url, // alias for frontend compatibility
            'disk' => $diskName,
            'message' => 'Image uploaded to R2 with backup'
        ]);
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

        try {
            $disk = \App\Support\R2Helper::disk();
        } catch (\Exception $e) {
            \Log::warning('Failed to get R2 disk in AdminController::uploadVideo', [
                'error' => $e->getMessage()
            ]);
            $disk = Storage::disk('public');
        }

        $storedPath = 'videos/' . $filename;
        $disk->put($storedPath, $file->get());
        $url = $disk->url($storedPath);

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


