<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class Section extends Model
{
    protected $fillable = [
        'key',
        'content',
        'image',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

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
        return static::all()->mapWithKeys(function ($section) {
            $imageUrl = null;
            if ($section->image) {
                // Add timestamp to bust browser cache
                $imageUrl = asset('storage/' . $section->image) . '?v=' . $section->updated_at->timestamp;
            }
            
            return [$section->key => [
                'content' => $section->content,
                'image' => $imageUrl,
            ]];
        })->toArray();
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

