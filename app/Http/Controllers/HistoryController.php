<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\SectionRevision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HistoryController extends Controller
{
    /**
     * Display the history management dashboard
     */
    public function index(Request $request)
    {
        try {
            $diskName = config('filesystems.default', 'r2');
            
            // Use R2Helper for safe disk access
            try {
                $disk = \App\Support\R2Helper::disk();
            } catch (\Exception $e) {
                \Log::warning('Failed to get R2 disk in HistoryController', [
                    'error' => $e->getMessage()
                ]);
                $disk = Storage::disk('public');
            }
        } catch (\Exception $e) {
            \Log::error('Error in HistoryController::index', [
                'error' => $e->getMessage()
            ]);
            $disk = Storage::disk('public');
        }
        
        // Get all sections with their latest revisions
        $sections = Section::all()->map(function ($section) use ($disk) {
            try {
                $latestRevisions = SectionRevision::where('key', $section->key)
                    ->orderByDesc('created_at')
                    ->limit(5)
                    ->get()
                    ->map(function ($revision) {
                        // Use R2Helper for safe URL generation
                        $imageUrl = null;
                        if ($revision->image) {
                            try {
                                $imageUrl = \App\Support\R2Helper::url($revision->image);
                                if (!$imageUrl) {
                                    $imageUrl = asset('storage/' . $revision->image);
                                }
                            } catch (\Exception $e) {
                                \Log::warning('Error generating revision image URL', [
                                    'error' => $e->getMessage()
                                ]);
                                $imageUrl = asset('storage/' . $revision->image);
                            }
                        }
                        
                        return [
                            'id' => $revision->id,
                            'content' => $revision->content,
                            'image' => $imageUrl,
                            'changed_by' => $revision->changed_by,
                            'change_type' => $revision->change_type,
                            'created_at' => $revision->created_at->format('Y-m-d H:i:s'),
                            'created_at_human' => $revision->created_at->diffForHumans(),
                        ];
                    });

                // Generate R2 URL for current image
                $currentImageUrl = null;
                if ($section->image) {
                    try {
                        $currentImageUrl = \App\Support\R2Helper::url($section->image);
                        if (!$currentImageUrl) {
                            $currentImageUrl = asset('storage/' . $section->image);
                        }
                    } catch (\Exception $e) {
                        \Log::warning('Error generating current image URL', [
                            'error' => $e->getMessage()
                        ]);
                        $currentImageUrl = asset('storage/' . $section->image);
                    }
                }
            } catch (\Exception $e) {
                \Log::error('Error processing section in HistoryController', [
                    'key' => $section->key ?? 'unknown',
                    'error' => $e->getMessage()
                ]);
                return [
                    'key' => $section->key ?? 'unknown',
                    'current_content' => $section->content ?? null,
                    'current_image' => null,
                    'updated_at' => $section->updated_at?->format('Y-m-d H:i:s') ?? now()->format('Y-m-d H:i:s'),
                    'revisions' => [],
                    'total_revisions' => 0,
                ];
            }
            
                return [
                    'key' => $section->key,
                    'current_content' => $section->content,
                    'current_image' => $currentImageUrl,
                    'updated_at' => $section->updated_at->format('Y-m-d H:i:s'),
                    'revisions' => $latestRevisions,
                    'total_revisions' => SectionRevision::where('key', $section->key)->count(),
                ];
            });

        return Inertia::render('admin/history', [
            'sections' => $sections,
        ]);
    }

    /**
     * Restore a specific revision
     */
    public function restore(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
            'revision_id' => 'required|exists:section_revisions,id',
        ]);

        $section = Section::where('key', $validated['key'])->first();
        
        if (!$section) {
            return back()->with('error', 'Section not found');
        }

        $revision = SectionRevision::find($validated['revision_id']);
        
        if (!$revision) {
            return back()->with('error', 'Revision not found');
        }

        // Restore using the model method
        $section->restoreFromRevision($validated['revision_id']);

        return back()->with('success', 'Successfully restored to previous version!');
    }
}
