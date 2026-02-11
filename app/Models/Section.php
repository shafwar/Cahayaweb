<?php

namespace App\Models;

use App\Support\SectionDefaults;
use App\Support\R2Helper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;

class Section extends Model
{
    protected static bool $snapshotsPaused = false;
    protected $fillable = [
        'key',
        'content',
        'image',
        'video',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::saved(function () {
            if (! static::$snapshotsPaused) {
                static::snapshot();
            }
            // Clear cache when section is saved
            static::clearCache();
        });
        
        static::deleted(function () {
            // Clear cache when section is deleted
            static::clearCache();
        });
    }

    protected static function snapshot(): void
    {
        try {
            // Check if database tables exist before attempting snapshot
            if (! \Illuminate\Support\Facades\Schema::hasTable('sections') || 
                ! \Illuminate\Support\Facades\Schema::hasTable('section_snapshots')) {
                return;
            }

            $payload = static::orderBy('key')
                ->get(['key', 'content', 'image', 'video'])
                ->mapWithKeys(fn (Section $section) => [
                    $section->key => $section->only(['key', 'content', 'image', 'video']),
                ])
                ->all();

            SectionSnapshot::savePayload($payload);
        } catch (\PDOException $e) {
            // Database connection issue - log but don't crash
            Log::warning('Database error during snapshot creation', [
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            // Any other error - log but don't crash
            Log::warning('Error creating snapshot', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public static function withoutSnapshots(callable $callback): void
    {
        static::$snapshotsPaused = true;

        try {
            $callback();
        } finally {
            static::$snapshotsPaused = false;
            static::snapshot();
        }
    }

    /**
     * Get the revisions for the section.
     */
    public function revisions(): HasMany
    {
        return $this->hasMany(SectionRevision::class);
    }

    /**
     * Get all sections as key-value pairs
     * Cached for 5 minutes to improve performance (sections don't change frequently)
     */
    public static function getAllSections(): array
    {
        // Cache key - include app environment to avoid cache conflicts
        $cacheKey = 'sections_all_' . config('app.env', 'production');
        
        // Try to get from cache first (5 minutes TTL)
        // Wrap in try-catch to prevent crashes if cache driver is not available
        try {
            return \Illuminate\Support\Facades\Cache::remember($cacheKey, 300, function () {
            try {
                // Check if table exists before querying
                if (! \Illuminate\Support\Facades\Schema::hasTable('sections')) {
                    $live = collect([]);
                } else {
                    $live = static::all()->mapWithKeys(fn ($section) => [$section->key => $section]);
                }
            } catch (\PDOException $e) {
                Log::warning('Database error getting sections', [
                    'error' => $e->getMessage()
                ]);
                $live = collect([]);
            } catch (\Exception $e) {
                Log::warning('Error getting sections', [
                    'error' => $e->getMessage()
                ]);
                $live = collect([]);
            } catch (\Throwable $e) {
                Log::error('Fatal error getting sections', [
                    'error' => $e->getMessage()
                ]);
                $live = collect([]);
            }
            
            try {
                $snapshot = SectionSnapshot::latestPayload();
            } catch (\Throwable $e) {
                Log::warning('Error getting snapshot', [
                    'error' => $e->getMessage()
                ]);
                $snapshot = collect([]);
            }
            
            try {
                $defaults = SectionDefaults::all();
            } catch (\Throwable $e) {
                Log::warning('Error getting defaults', [
                    'error' => $e->getMessage()
                ]);
                $defaults = [];
            }

            try {
                $keys = $snapshot->keys()
                    ->merge($live->keys())
                    ->merge(collect(array_keys($defaults)))
                    ->unique();

                return $keys->mapWithKeys(function ($key) use ($live, $snapshot, $defaults) {
                    try {
                        $section = $live->get($key);
                        $payload = $snapshot->get($key);

                        // Priority: Live DB > Snapshot > Default
                        $content = $section?->content ?? Arr::get($payload, 'content');
                        $imagePath = $section?->image ?? Arr::get($payload, 'image');

                        // If no content from live/snapshot, try default
                        if (! $content && isset($defaults[$key]['content'])) {
                            $content = $defaults[$key]['content'];
                        }

                        // Handle image URL with error handling
                        $imageUrl = null;
                        if ($imagePath) {
                            try {
                                // Image from DB or snapshot - use R2 URL
                                $r2Url = R2Helper::url($imagePath);
                                if ($r2Url) {
                                    $timestamp = optional($section?->updated_at)->timestamp ?? time();
                                    $imageUrl = $r2Url . (str_contains($r2Url, '?') ? '&' : '?') . 'v=' . $timestamp;
                                } else {
                                    // R2 not configured - still use R2 URL structure
                                    $r2BaseUrl = 'https://assets.cahayaanbiya.com';
                                    $cleanPath = trim($imagePath, '/');
                                    $r2Url = $r2BaseUrl . '/public/images/' . $cleanPath;
                                    $timestamp = optional($section?->updated_at)->timestamp ?? time();
                                    $imageUrl = $r2Url . '?v=' . $timestamp;
                                }
                            } catch (\Exception $e) {
                                Log::warning('Error generating image URL for section', [
                                    'key' => $key,
                                    'path' => $imagePath,
                                    'error' => $e->getMessage()
                                ]);
                                // On error, still use R2 URL structure
                                $r2BaseUrl = 'https://assets.cahayaanbiya.com';
                                $cleanPath = trim($imagePath, '/');
                                $r2Url = $r2BaseUrl . '/public/images/' . $cleanPath;
                                $timestamp = optional($section?->updated_at)->timestamp ?? time();
                                $imageUrl = $r2Url . '?v=' . $timestamp;
                            }
                        } elseif (isset($defaults[$key])) {
                            try {
                                $url = SectionDefaults::imageUrl($key);
                                if ($url) {
                                    $imageUrl = $url;
                                }
                            } catch (\Exception $e) {
                                Log::warning('Error getting default image URL', [
                                    'key' => $key,
                                    'error' => $e->getMessage()
                                ]);
                            }
                        }

                        $videoUrl = null;
                        $videoPath = $section?->video ?? Arr::get($payload, 'video');
                        if ($videoPath) {
                            try {
                                $r2Url = R2Helper::url($videoPath);
                                if ($r2Url) {
                                    $timestamp = optional($section?->updated_at)->timestamp ?? time();
                                    $videoUrl = $r2Url . (str_contains($r2Url, '?') ? '&' : '?') . 'v=' . $timestamp;
                                } else {
                                    $r2BaseUrl = 'https://assets.cahayaanbiya.com';
                                    $cleanPath = trim($videoPath, '/');
                                    $videoUrl = $r2BaseUrl . '/public/' . (str_starts_with($cleanPath, 'videos/') ? $cleanPath : 'videos/' . $cleanPath) . '?v=' . (optional($section?->updated_at)->timestamp ?? time());
                                }
                            } catch (\Exception $e) {
                                Log::warning('Error generating video URL for section', ['key' => $key, 'error' => $e->getMessage()]);
                            }
                        } elseif (isset($defaults[$key]['video_path'])) {
                            try {
                                $videoUrl = R2Helper::url($defaults[$key]['video_path']);
                            } catch (\Exception $e) {
                                // ignore
                            }
                        }

                        return [$key => [
                            'content' => $content,
                            'image' => $imageUrl,
                            'video' => $videoUrl,
                        ]];
                    } catch (\Exception $e) {
                        Log::warning('Error processing section', [
                            'key' => $key,
                            'error' => $e->getMessage()
                        ]);
                        // Return empty section on error
                        return [$key => [
                            'content' => null,
                            'image' => null,
                            'video' => null,
                        ]];
                    }
                })->filter(function ($value) {
                    return $value['content'] !== null || $value['image'] !== null || $value['video'] !== null;
                })->toArray();
            } catch (\Throwable $e) {
                Log::error('Fatal error in getAllSections mapWithKeys', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                // Return empty array on fatal error to prevent 500
                return [];
            }
            });
        } catch (\Throwable $e) {
            // If cache fails, execute the closure directly without caching
            // This ensures the application still works even if cache driver is unavailable
            Log::warning('Cache error in getAllSections, executing without cache', [
                'error' => $e->getMessage()
            ]);
            
            // Execute the same logic but without caching
            try {
                // Check if table exists before querying
                if (! \Illuminate\Support\Facades\Schema::hasTable('sections')) {
                    $live = collect([]);
                } else {
                    $live = static::all()->mapWithKeys(fn ($section) => [$section->key => $section]);
                }
            } catch (\PDOException $e) {
                Log::warning('Database error getting sections', [
                    'error' => $e->getMessage()
                ]);
                $live = collect([]);
            } catch (\Exception $e) {
                Log::warning('Error getting sections', [
                    'error' => $e->getMessage()
                ]);
                $live = collect([]);
            } catch (\Throwable $e) {
                Log::error('Fatal error getting sections', [
                    'error' => $e->getMessage()
                ]);
                $live = collect([]);
            }
            
            try {
                $snapshot = SectionSnapshot::latestPayload();
            } catch (\Throwable $e) {
                Log::warning('Error getting snapshot', [
                    'error' => $e->getMessage()
                ]);
                $snapshot = collect([]);
            }
            
            try {
                $defaults = SectionDefaults::all();
            } catch (\Throwable $e) {
                Log::warning('Error getting defaults', [
                    'error' => $e->getMessage()
                ]);
                $defaults = [];
            }

            try {
                $keys = $snapshot->keys()
                    ->merge($live->keys())
                    ->merge(collect(array_keys($defaults)))
                    ->unique();

                return $keys->mapWithKeys(function ($key) use ($live, $snapshot, $defaults) {
                    try {
                        $section = $live->get($key);
                        $payload = $snapshot->get($key);

                        // Priority: Live DB > Snapshot > Default
                        $content = $section?->content ?? Arr::get($payload, 'content');
                        $imagePath = $section?->image ?? Arr::get($payload, 'image');

                        // If no content from live/snapshot, try default
                        if (! $content && isset($defaults[$key]['content'])) {
                            $content = $defaults[$key]['content'];
                        }

                        // Handle image URL with error handling
                        $imageUrl = null;
                        if ($imagePath) {
                            try {
                                // Image from DB or snapshot - use R2 URL
                                $r2Url = R2Helper::url($imagePath);
                                if ($r2Url) {
                                    $timestamp = optional($section?->updated_at)->timestamp ?? time();
                                    $imageUrl = $r2Url . (str_contains($r2Url, '?') ? '&' : '?') . 'v=' . $timestamp;
                                } else {
                                    // R2 not configured - still use R2 URL structure
                                    $r2BaseUrl = 'https://assets.cahayaanbiya.com';
                                    $cleanPath = trim($imagePath, '/');
                                    $r2Url = $r2BaseUrl . '/public/images/' . $cleanPath;
                                    $timestamp = optional($section?->updated_at)->timestamp ?? time();
                                    $imageUrl = $r2Url . '?v=' . $timestamp;
                                }
                            } catch (\Exception $e) {
                                Log::warning('Error generating image URL for section', [
                                    'key' => $key,
                                    'path' => $imagePath,
                                    'error' => $e->getMessage()
                                ]);
                                // On error, still use R2 URL structure
                                $r2BaseUrl = 'https://assets.cahayaanbiya.com';
                                $cleanPath = trim($imagePath, '/');
                                $r2Url = $r2BaseUrl . '/public/images/' . $cleanPath;
                                $timestamp = optional($section?->updated_at)->timestamp ?? time();
                                $imageUrl = $r2Url . '?v=' . $timestamp;
                            }
                        } elseif (isset($defaults[$key])) {
                            try {
                                $url = SectionDefaults::imageUrl($key);
                                if ($url) {
                                    $imageUrl = $url;
                                }
                            } catch (\Exception $e) {
                                Log::warning('Error getting default image URL', [
                                    'key' => $key,
                                    'error' => $e->getMessage()
                                ]);
                            }
                        }

                        $videoUrl = null;
                        $videoPath = $section?->video ?? Arr::get($payload, 'video');
                        if ($videoPath) {
                            try {
                                $r2Url = R2Helper::url($videoPath);
                                if ($r2Url) {
                                    $timestamp = optional($section?->updated_at)->timestamp ?? time();
                                    $videoUrl = $r2Url . (str_contains($r2Url, '?') ? '&' : '?') . 'v=' . $timestamp;
                                } else {
                                    $r2BaseUrl = 'https://assets.cahayaanbiya.com';
                                    $cleanPath = trim($videoPath, '/');
                                    $videoUrl = $r2BaseUrl . '/public/' . (str_starts_with($cleanPath, 'videos/') ? $cleanPath : 'videos/' . $cleanPath) . '?v=' . (optional($section?->updated_at)->timestamp ?? time());
                                }
                            } catch (\Exception $e) {
                                Log::warning('Error generating video URL for section', ['key' => $key, 'error' => $e->getMessage()]);
                            }
                        } elseif (isset($defaults[$key]['video_path'])) {
                            try {
                                $videoUrl = R2Helper::url($defaults[$key]['video_path']);
                            } catch (\Exception $e) {
                                // ignore
                            }
                        }

                        return [$key => [
                            'content' => $content,
                            'image' => $imageUrl,
                            'video' => $videoUrl,
                        ]];
                    } catch (\Exception $e) {
                        Log::warning('Error processing section', [
                            'key' => $key,
                            'error' => $e->getMessage()
                        ]);
                        // Return empty section on error
                        return [$key => [
                            'content' => null,
                            'image' => null,
                            'video' => null,
                        ]];
                    }
                })->filter(function ($value) {
                    return $value['content'] !== null || $value['image'] !== null || $value['video'] !== null;
                })->toArray();
            } catch (\Throwable $e) {
                Log::error('Fatal error in getAllSections mapWithKeys', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                // Return empty array on fatal error to prevent 500
                return [];
            }
        }
    }

    /**
     * Clear sections cache (call this when sections are updated)
     */
    /**
     * Clear sections cache (call this when sections are updated)
     */
    public static function clearCache(): void
    {
        \Illuminate\Support\Facades\Cache::forget('sections_all_' . config('app.env', 'production'));
    }

    public static function restoreFromSnapshot(string $key): bool
    {
        try {
            $payload = SectionSnapshot::dataForKey($key);

            if (! $payload) {
                // If no snapshot exists, try to delete the section
                try {
                    Section::where('key', $key)->delete();
                } catch (\Exception $e) {
                    Log::warning('Failed to delete section during restore', [
                        'key' => $key,
                        'error' => $e->getMessage()
                    ]);
                }
                return false;
            }

            // Restore section from snapshot
            $restored = false;
            static::withoutSnapshots(function () use ($key, $payload, &$restored) {
                $section = static::updateOrCreate(
                    ['key' => $key],
                    [
                        'content' => $payload['content'] ?? null,
                        'image' => $payload['image'] ?? null,
                        'video' => $payload['video'] ?? null,
                    ],
                );

                $section->refresh();
                $contentMatch = ($payload['content'] ?? null) === $section->content;
                $imageMatch = ($payload['image'] ?? null) === $section->image;
                $videoMatch = ($payload['video'] ?? null) === ($section->video ?? null);
                $restored = $contentMatch && $imageMatch && $videoMatch;
                
                if (!$restored) {
                    Log::warning('Restore verification failed in restoreFromSnapshot', [
                        'key' => $key,
                        'expected_content' => $payload['content'] ?? null,
                        'actual_content' => $section->content,
                        'expected_image' => $payload['image'] ?? null,
                        'actual_image' => $section->image,
                    ]);
                }
            });

            // Clear cache after restore
            SectionSnapshot::clearCache();

            return $restored;
        } catch (\PDOException $e) {
            Log::error('Database error during restore from snapshot', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('Error restoring section from snapshot', [
                'key' => $key,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Create a backup revision before updating
     */
    public function createRevision(string $changeType = 'update'): void
    {
        SectionRevision::create([
            'section_id' => $this->id,
            'key' => $this->key,
            'content' => $this->content,
            'image' => $this->image,
            'video' => $this->video ?? null,
            'changed_by' => Auth::user()?->email ?? 'system',
            'change_type' => $changeType,
        ]);
    }

    /**
     * Update section with auto-backup
     */
    public static function updateWithBackup(string $key, array $data, string $changeType = 'update'): self
    {
        $section = static::firstOrNew(['key' => $key]);
        
        // Create revision before updating (if section exists)
        if ($section->exists) {
            $section->createRevision($changeType);
        }
        
        $section->fill($data);
        $section->save();
        
        // Clear cache after update (save() triggers booted() which clears cache, but ensure it's cleared)
        static::clearCache();
        
        return $section;
    }

    /**
     * Restore section from a revision
     */
    public function restoreFromRevision(int $revisionId): bool
    {
        $revision = SectionRevision::find($revisionId);
        
        if (!$revision || $revision->key !== $this->key) {
            return false;
        }

        // Create backup of current state before restoring
        $this->createRevision('restore');

        // Restore from revision
        $this->update([
            'content' => $revision->content,
            'image' => $revision->image,
            'video' => $revision->video ?? null,
        ]);

        return true;
    }
}

