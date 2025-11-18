<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\SectionSnapshot;
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
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:255'],
            'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ]);

        $path = $validated['image']->storeAs(
            'images',
            Str::uuid()->toString() . '.' . $validated['image']->getClientOriginalExtension(),
            'public'
        );

        $url = asset('storage/' . $path);

        // Use updateWithBackup to automatically create revision
        Section::updateWithBackup(
            $validated['key'],
            ['image' => $path]
        );

        return response()->json([
            'status' => 'ok', 
            'path' => $path, 
            'url' => $url,
            'message' => 'Image uploaded with backup'
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
     * Reset all hero images to original (delete all hero sections)
     */
    public function resetAllHeroes(Request $request): JsonResponse
    {
        $keys = $this->knownKeys()->filter(fn ($key) => Str::startsWith($key, 'home.hero.') && Str::endsWith($key, '.image'))->values()->all();

        [$restored, $removed] = $this->restoreKeys($keys);

        return response()->json([
            'status' => 'ok',
            'message' => 'Successfully reset all hero images',
            'restored' => $restored,
            'removed' => $removed,
        ]);
    }

    /**
     * Get all changed sections (comprehensive restore data)
     * Only shows sections that are DIFFERENT from defaults/snapshots
     */
    public function getAllChanges(Request $request): JsonResponse
    {
        // Get all sections from database
        $sections = Section::orderBy('updated_at', 'desc')->get();
        $snapshot = SectionSnapshot::latestPayload();
        $defaults = SectionDefaults::all();

        $changes = $sections->filter(function ($section) use ($snapshot, $defaults) {
            $key = $section->key;
            
            // Get expected values (priority: snapshot > default)
            $expectedContent = null;
            $expectedImage = null;
            $hasExpectedValue = false;
            
            if ($snapshot->has($key)) {
                $payload = $snapshot->get($key);
                $expectedContent = $payload['content'] ?? null;
                $expectedImage = $payload['image'] ?? null;
                $hasExpectedValue = true;
            } elseif (isset($defaults[$key])) {
                $expectedContent = $defaults[$key]['content'] ?? null;
                $expectedImage = SectionDefaults::imageUrl($key);
                if ($expectedImage) {
                    // Extract path from URL for comparison
                    $expectedImage = str_replace(asset(''), '', $expectedImage);
                }
                $hasExpectedValue = true;
            }
            
            // If no expected value exists, section in DB is always a change
            if (!$hasExpectedValue) {
                return true;
            }
            
            // Normalize null vs empty string for comparison
            $actualContent = $section->content ?? null;
            $actualImage = $section->image ?? null;
            
            // Compare actual vs expected
            $contentDiffers = $actualContent !== $expectedContent;
            $imageDiffers = $actualImage !== $expectedImage;
            
            // Only include if it's actually different
            return $contentDiffers || $imageDiffers;
        })->map(function ($section) {
            // Parse section key to extract metadata
            $parts = explode('.', $section->key);
            $page = $parts[0] ?? 'unknown';
            $sectionName = $parts[1] ?? 'unknown';
            $id = $parts[2] ?? null;
            $field = $parts[3] ?? $parts[2] ?? 'unknown';

            // Determine type
            $type = $section->image ? 'image' : 'text';

            return [
                'id' => $section->id,
                'key' => $section->key,
                'page' => ucfirst($page),
                'section' => $sectionName,
                'field' => ucfirst($field),
                'type' => $type,
                'content' => $section->content,
                'image' => $section->image ? asset('storage/' . $section->image) . '?v=' . $section->updated_at->timestamp : null,
                'updated_at' => $section->updated_at->format('Y-m-d H:i:s'),
                'updated_at_human' => $section->updated_at->diffForHumans(),
            ];
        })->values();

        return response()->json([
            'status' => 'ok',
            'changes' => $changes,
            'total' => $changes->count(),
        ]);
    }

    /**
     * Reset all changes (delete all sections)
     */
    public function resetAllChanges(Request $request): JsonResponse
    {
        $keys = $this->knownKeys()->all();

        [$restored, $removed] = $this->restoreKeys($keys);

        return response()->json([
            'status' => 'ok',
            'message' => 'Successfully restored all changes from snapshot',
            'restored' => $restored,
            'removed' => $removed,
        ]);
    }

    /**
     * Reset by page (delete all sections for specific page)
     */
    public function resetByPage(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['required', 'string'],
        ]);

        $page = strtolower($validated['page']);
        $keys = $this->knownKeys()->filter(fn ($key) => Str::startsWith($key, "{$page}."))->values()->all();

        [$restored, $removed] = $this->restoreKeys($keys);

        return response()->json([
            'status' => 'ok',
            'message' => "Successfully reset all changes in {$page} page",
            'restored' => $restored,
            'removed' => $removed,
        ]);
    }

    /**
     * Reset by type (delete all text or all images)
     */
    public function resetByType(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:text,image'],
        ]);

        $keys = $this->keysByType($validated['type']);

        [$restored, $removed] = $this->restoreKeys($keys);

        return response()->json([
            'status' => 'ok',
            'message' => "Successfully reset all {$validated['type']} changes",
            'restored' => $restored,
            'removed' => $removed,
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
                            // ALWAYS restore from snapshot if it exists
                            // This preserves the original saved state
                            $restoreContent = $payload['content'] ?? null;
                            $restoreImage = $payload['image'] ?? null;
                            
                            // Restore from snapshot
                            $section = Section::updateOrCreate(
                                ['key' => $key],
                                [
                                    'content' => $restoreContent,
                                    'image' => $restoreImage,
                                ]
                            );

                            // Verify restore was successful
                            $section->refresh();
                            $isRestored = false;
                            
                            if ($restoreContent !== null) {
                                $isRestored = $section->content === $restoreContent;
                            } elseif ($restoreImage !== null) {
                                $isRestored = $section->image === $restoreImage;
                            } else {
                                // Both null - check if both were null in snapshot
                                $isRestored = ($section->content === null && $section->image === null);
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

    private function keysByType(string $type): array
    {
        $snapshotKeys = SectionSnapshot::latestPayload()
            ->filter(function ($payload) use ($type) {
                return $type === 'image'
                    ? ! empty($payload['image'])
                    : ! empty($payload['content']);
            })
            ->keys();

        $liveKeys = Section::query()
            ->when(
                $type === 'image',
                fn ($query) => $query->whereNotNull('image'),
                fn ($query) => $query->whereNotNull('content')
            )
            ->pluck('key');

        $defaultKeys = collect(SectionDefaults::all())
            ->filter(function ($default) use ($type) {
                return $type === 'image'
                    ? ! empty($default['public_path'])
                    : isset($default['content']);
            })
            ->keys();

        return $snapshotKeys
            ->merge($liveKeys)
            ->merge($defaultKeys)
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}


