<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\SectionSnapshot;
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

        return response()->json([
            'status' => 'ok',
            'message' => $restored > 0
                ? 'Successfully restored from latest snapshot'
                : 'No snapshot available; key removed to use factory default',
            'restored' => $restored,
            'removed' => $removed,
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
     */
    public function getAllChanges(Request $request): JsonResponse
    {
        // Get all sections from database (anything in DB = changed from original)
        $sections = Section::orderBy('updated_at', 'desc')->get();

        $changes = $sections->map(function ($section) {
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
        });

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

        Section::withoutSnapshots(function () use ($keys, &$restored, &$removed) {
            foreach (array_unique($keys) as $key) {
                if (! $key) {
                    continue;
                }

                if (Section::restoreFromSnapshot($key)) {
                    $restored++;
                } else {
                    $removed++;
                }
            }
        });

        return [$restored, $removed];
    }

    private function knownKeys(): \Illuminate\Support\Collection
    {
        return SectionSnapshot::latestPayload()->keys()
            ->merge(Section::pluck('key'))
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

        return $snapshotKeys->merge($liveKeys)->filter()->unique()->values()->all();
    }
}


