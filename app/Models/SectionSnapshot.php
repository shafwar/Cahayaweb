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

    public static function latestPayload(): Collection
    {
        $snapshot = static::query()->latest()->value('payload') ?? [];

        return collect($snapshot);
    }

    public static function savePayload(array $payload): void
    {
        static::create(['payload' => $payload]);
    }
}

