<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class B2cTravelPackage extends Model
{
    protected $fillable = [
        'slug',
        'package_code',
        'name',
        'departure_period',
        'description',
        'location',
        'duration_label',
        'package_type',
        'price_display',
        'pax_capacity',
        'pax_booked',
        'registration_deadline',
        'terms_and_conditions',
        'status',
        'image_path',
        'highlights_json',
        'features_json',
        'dates_json',
        'hotels_json',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'registration_deadline' => 'datetime',
            'highlights_json' => 'array',
            'features_json' => 'array',
            'dates_json' => 'array',
            'hotels_json' => 'array',
            'pax_capacity' => 'integer',
            'pax_booked' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(B2cPackageRegistration::class, 'b2c_travel_package_id');
    }

    public function isOpenForRegistration(): bool
    {
        if ($this->status !== 'open') {
            return false;
        }
        if ($this->pax_booked >= $this->pax_capacity) {
            return false;
        }
        /** @var Carbon $deadline */
        $deadline = $this->registration_deadline;

        return $deadline->isFuture();
    }

    public function availablePaxSlots(): int
    {
        return max(0, $this->pax_capacity - $this->pax_booked);
    }

    public static function generateUniqueSlug(string $name, string $packageCode): string
    {
        $base = Str::slug($name);
        if ($base === '') {
            $base = 'package';
        }
        $suffix = Str::lower(preg_replace('/[^a-zA-Z0-9]+/', '', $packageCode) ?: '');
        $slug = $suffix !== '' ? $base.'-'.$suffix : $base;
        $original = $slug;
        $n = 1;
        while (static::query()->where('slug', $slug)->exists()) {
            $slug = $original.'-'.$n;
            $n++;
        }

        return $slug;
    }

    /**
     * @return array<string, mixed>
     */
    public function toCardProps(): array
    {
        $highlights = $this->highlights_json ?? [];
        $features = $this->features_json ?? [];
        $dates = $this->dates_json ?? [];
        $hotels = $this->hotels_json ?? [];

        $paxLabel = $this->pax_booked.' / '.$this->pax_capacity.' pax';

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->name,
            'location' => $this->location ?? '',
            'duration' => $this->duration_label ?? $this->departure_period,
            'price' => $this->price_display,
            'pax' => $paxLabel,
            'type' => $this->package_type,
            'image' => ($this->image_path !== null && $this->image_path !== '')
                ? $this->image_path
                : '/images/packages/packages1.png',
            'highlights' => is_array($highlights) ? $highlights : [],
            'description' => $this->description,
            'features' => is_array($features) ? $features : [],
            'dates' => is_array($dates) ? $dates : [],
            'hotels' => is_array($hotels) ? $hotels : [],
            'registration_open' => $this->isOpenForRegistration(),
            'registration_deadline' => $this->registration_deadline->toIso8601String(),
            'departure_period' => $this->departure_period,
            'terms_and_conditions' => $this->terms_and_conditions,
            'from_database' => true,
            'filter_pax_capacity' => $this->pax_capacity,
        ];
    }
}
