<?php

namespace App\Support;

use Illuminate\Support\Arr;

class SectionDefaults
{
    public static function all(): array
    {
        return config('sections.defaults', []);
    }

    public static function get(string $key): ?array
    {
        $defaults = static::all();
        return $defaults[$key] ?? null;
    }

    public static function has(string $key): bool
    {
        return static::get($key) !== null;
    }

    public static function content(string $key): ?string
    {
        $default = static::get($key);
        return $default['content'] ?? null;
    }

    public static function imageUrl(string $key): ?string
    {
        $default = static::get($key);
        $path = Arr::get($default, 'public_path');

        if (! $path || (Arr::get($default, 'type') !== 'image')) {
            return null;
        }

        return asset($path);
    }
}

