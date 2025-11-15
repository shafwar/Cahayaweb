<?php

namespace App\Support;

use App\Models\Section;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SectionSnapshot
{
    private const SNAPSHOT_PATH = 'sections_snapshot.json';

    public static function write(): void
    {
        try {
            $payload = Section::orderBy('key')
                ->get(['key', 'content', 'image', 'updated_at'])
                ->map(fn (Section $section) => [
                    'key' => $section->key,
                    'content' => $section->content,
                    'image' => $section->image,
                    'updated_at' => optional($section->updated_at)?->toISOString(),
                ])
                ->all();

            Storage::disk('local')->put(self::SNAPSHOT_PATH, json_encode($payload));
        } catch (\Throwable $exception) {
            Log::warning('Failed to write section snapshot', ['exception' => $exception->getMessage()]);
        }
    }

    public static function restoreIfMissing(): void
    {
        if (Section::count() > 0) {
            return;
        }

        if (! Storage::disk('local')->exists(self::SNAPSHOT_PATH)) {
            return;
        }

        try {
            $raw = Storage::disk('local')->get(self::SNAPSHOT_PATH);
            $rows = json_decode($raw, true, flags: JSON_THROW_ON_ERROR);

            if (! is_array($rows)) {
                return;
            }

            foreach ($rows as $row) {
                Section::updateOrCreate(
                    ['key' => Arr::get($row, 'key')],
                    [
                        'content' => Arr::get($row, 'content'),
                        'image' => Arr::get($row, 'image'),
                    ],
                );
            }
        } catch (\Throwable $exception) {
            Log::warning('Failed to restore section snapshot', ['exception' => $exception->getMessage()]);
        }
    }
}

