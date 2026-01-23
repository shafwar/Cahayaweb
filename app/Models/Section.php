<?php

namespace App\Models;

use App\Support\SectionDefaults;
use App\Support\R2Helper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;

class Section extends Model
{
    protected static bool $snapshotsPaused = false;
    protected $fillable = [
        'key',
        'content',
        'image',
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
                ->get(['key', 'content', 'image'])
                ->mapWithKeys(fn (Section $section) => [
                    $section->key => $section->only(['key', 'content', 'image']),
                ])
                ->all();

            SectionSnapshot::savePayload($payload);
        } catch (\PDOException $e) {
            // Database connection issue - log but don't crash
            \Log::warning('Database error during snapshot creation', [
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            // Any other error - log but don't crash
            \Log::warning('Error creating snapshot', [
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
     */
    public static function getAllSections(): array
    {
        try {
            // Check if table exists before querying
            if (! \Illuminate\Support\Facades\Schema::hasTable('sections')) {
                $live = collect([]);
            } else {
        $live = static::all()->mapWithKeys(fn ($section) => [$section->key => $section]);
            }
        } catch (\PDOException $e) {
            \Log::warning('Database error getting sections', [
                'error' => $e->getMessage()
            ]);
            $live = collect([]);
        } catch (\Exception $e) {
            \Log::warning('Error getting sections', [
                'error' => $e->getMessage()
            ]);
            $live = collect([]);
        }
        
        $snapshot = SectionSnapshot::latestPayload();
        $defaults = SectionDefaults::all();

        $keys = $snapshot->keys()
            ->merge($live->keys())
            ->merge(collect(array_keys($defaults)))
            ->unique();

        return $keys->mapWithKeys(function ($key) use ($live, $snapshot, $defaults) {
            $section = $live->get($key);
            $payload = $snapshot->get($key);

            // Priority: Live DB > Snapshot > Default
            $content = $section?->content ?? Arr::get($payload, 'content');
            $imagePath = $section?->image ?? Arr::get($payload, 'image');

            // If no content from live/snapshot, try default
            if (! $content && isset($defaults[$key]['content'])) {
                $content = $defaults[$key]['content'];
            }

            // Handle image URL
            $imageUrl = null;
            if ($imagePath) {
                // Image from DB or snapshot - use R2 URL
                $r2Url = R2Helper::url($imagePath);
                if ($r2Url) {
                    $timestamp = optional($section?->updated_at)->timestamp ?? time();
                    $imageUrl = $r2Url . (str_contains($r2Url, '?') ? '&' : '?') . 'v=' . $timestamp;
                } else {
                    // Fallback to local storage if R2 not configured
                    $timestamp = optional($section?->updated_at)->timestamp ?? time();
                    $imageUrl = asset('storage/' . $imagePath) . '?v=' . $timestamp;
                }
            } elseif (isset($defaults[$key]) && ($url = SectionDefaults::imageUrl($key))) {
                // Image from default
                $imageUrl = $url;
            }

            return [$key => [
                'content' => $content,
                'image' => $imageUrl,
            ]];
        })->filter(function ($value) {
            // Include if has content OR image (even if null, as long as key exists)
            return $value['content'] !== null || $value['image'] !== null;
        })->toArray();
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
                    \Log::warning('Failed to delete section during restore', [
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
                    ],
                );

                // Verify restore was successful
                $section->refresh();
                
                // Check if content matches
                $contentMatch = ($payload['content'] ?? null) === $section->content;
                $imageMatch = ($payload['image'] ?? null) === $section->image;
                
                $restored = $contentMatch && $imageMatch;
                
                if (!$restored) {
                    \Log::warning('Restore verification failed in restoreFromSnapshot', [
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
            \Log::error('Database error during restore from snapshot', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            return false;
        } catch (\Exception $e) {
            \Log::error('Error restoring section from snapshot', [
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
        ]);

        return true;
    }
}

