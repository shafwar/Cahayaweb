<?php

namespace App\Models;

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
        $payload = static::orderBy('key')
            ->get(['key', 'content', 'image'])
            ->mapWithKeys(fn (Section $section) => [
                $section->key => $section->only(['key', 'content', 'image']),
            ])
            ->all();

        SectionSnapshot::savePayload($payload);
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
        $live = static::all()->mapWithKeys(fn ($section) => [$section->key => $section]);
        $snapshot = SectionSnapshot::latestPayload();

        $keys = $snapshot->keys()->merge($live->keys())->unique();

        return $keys->mapWithKeys(function ($key) use ($live, $snapshot) {
            $section = $live->get($key);
            $payload = $snapshot->get($key);

            $content = $section->content ?? Arr::get($payload, 'content');
            $imagePath = $section->image ?? Arr::get($payload, 'image');

            $imageUrl = null;
            if ($imagePath) {
                $timestamp = optional($section?->updated_at)->timestamp ?? time();
                $imageUrl = asset('storage/' . $imagePath) . '?v=' . $timestamp;
            }

            return [$key => [
                'content' => $content,
                'image' => $imageUrl,
            ]];
        })->filter(function ($value) {
            return $value['content'] !== null || $value['image'] !== null;
        })->toArray();
    }

    public static function restoreFromSnapshot(string $key): bool
    {
        $payload = SectionSnapshot::dataForKey($key);

        if (! $payload) {
            Section::where('key', $key)->delete();
            return false;
        }

        static::updateOrCreate(
            ['key' => $key],
            [
                'content' => $payload['content'] ?? null,
                'image' => $payload['image'] ?? null,
            ],
        );

        return true;
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

