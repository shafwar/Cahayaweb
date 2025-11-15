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

        $snapshot = static::query()->latest()->value('payload') ?? [];

        return static::$cachedPayload = collect($snapshot)->mapWithKeys(function ($entry) {
            return [$entry['key'] ?? null => $entry];
        })->filter(fn ($entry, $key) => $key !== null);
    }

    public static function savePayload(array $payload): void
    {
        static::create(['payload' => array_values($payload)]);
        static::$cachedPayload = null;
    }

    public static function dataForKey(string $key): ?array
    {
        return static::latestPayload()->get($key);
    }
}

