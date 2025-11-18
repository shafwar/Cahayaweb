<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class SectionSnapshot extends Model
{
    protected $fillable = ['payload'];

    protected $casts = [
        'payload' => 'array',
    ];

    protected static ?Collection $cachedPayload = null;

    public static function latestPayload(): Collection
    {
        if (static::$cachedPayload instanceof Collection) {
            return static::$cachedPayload;
        }

        try {
            // Check if table exists before querying
            if (! \Illuminate\Support\Facades\Schema::hasTable('section_snapshots')) {
                return static::$cachedPayload = collect([]);
            }

            $snapshot = static::query()->latest()->value('payload') ?? [];

            return static::$cachedPayload = collect($snapshot)->mapWithKeys(function ($entry) {
                return [$entry['key'] ?? null => $entry];
            })->filter(fn ($entry, $key) => $key !== null);
        } catch (\PDOException $e) {
            \Log::warning('Database error getting latest payload', [
                'error' => $e->getMessage()
            ]);
            return static::$cachedPayload = collect([]);
        } catch (\Exception $e) {
            \Log::warning('Error getting latest payload', [
                'error' => $e->getMessage()
            ]);
            return static::$cachedPayload = collect([]);
        }
    }

    public static function savePayload(array $payload): void
    {
        try {
            // Check if table exists before saving
            if (! \Illuminate\Support\Facades\Schema::hasTable('section_snapshots')) {
                \Log::warning('section_snapshots table does not exist, skipping save');
                return;
            }

            static::create(['payload' => array_values($payload)]);
            static::$cachedPayload = null;
        } catch (\PDOException $e) {
            \Log::error('Database error saving payload', [
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error saving payload', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public static function dataForKey(string $key): ?array
    {
        try {
            return static::latestPayload()->get($key);
        } catch (\Exception $e) {
            \Log::warning('Error getting data for key', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }
}

