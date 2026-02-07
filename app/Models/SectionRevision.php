<?php

namespace App\Models;

use App\Support\R2Helper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SectionRevision extends Model
{
    protected $fillable = [
        'section_id',
        'key',
        'content',
        'image',
        'video',
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
                $imageUrl = null;
                if ($revision->image) {
                    try {
                        $imageUrl = R2Helper::url($revision->image);
                        if (!$imageUrl) {
                            // Fallback to local storage
                            $imageUrl = asset('storage/' . $revision->image);
                        }
                    } catch (\Exception $e) {
                        \Log::warning('Error generating revision image URL', [
                            'revision_id' => $revision->id,
                            'error' => $e->getMessage()
                        ]);
                        // Fallback to local storage on error
                        $imageUrl = asset('storage/' . $revision->image);
                    }
                }
                
                return [
                    'id' => $revision->id,
                    'content' => $revision->content,
                    'image' => $imageUrl,
                    'changed_by' => $revision->changed_by,
                    'change_type' => $revision->change_type,
                    'created_at' => $revision->created_at->diffForHumans(),
                    'created_at_formatted' => $revision->created_at->format('Y-m-d H:i:s'),
                ];
            })
            ->toArray();
    }
}

