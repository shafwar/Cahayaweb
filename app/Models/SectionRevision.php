<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SectionRevision extends Model
{
    protected $fillable = [
        'section_id',
        'key',
        'content',
        'image',
        'changed_by',
        'change_type',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the section that owns the revision.
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    /**
     * Get revisions for a specific section key
     */
    public static function getRevisions(string $key, int $limit = 10): array
    {
        return static::where('key', $key)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($revision) {
                return [
                    'id' => $revision->id,
                    'content' => $revision->content,
                    'image' => $revision->image ? asset('storage/' . $revision->image) : null,
                    'changed_by' => $revision->changed_by,
                    'change_type' => $revision->change_type,
                    'created_at' => $revision->created_at->diffForHumans(),
                    'created_at_formatted' => $revision->created_at->format('Y-m-d H:i:s'),
                ];
            })
            ->toArray();
    }
}

