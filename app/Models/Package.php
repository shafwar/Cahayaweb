<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'destination',
        'description',
        'price',
        'b2b_price',
        'duration_days',
        'max_travelers',
        'departure_date',
        'return_date',
        'image_path',
        'is_active',
        'inclusions',
        'exclusions',
        'itinerary',
    ];

    protected $casts = [
        'price' => 'float',
        'b2b_price' => 'float',
        'duration_days' => 'integer',
        'max_travelers' => 'integer',
        'departure_date' => 'date',
        'return_date' => 'date',
        'is_active' => 'boolean',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'itinerary' => 'array',
    ];

    /**
     * Get the itinerary attribute as an array
     */
    public function getItineraryAttribute($value)
    {
        // If value is null or empty, return empty array
        if (empty($value)) {
            return [];
        }

        // If already an array, return as is
        if (is_array($value)) {
            return $value;
        }

        // If string, try to decode JSON
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
        }

        return [];
    }

    /**
     * Get the inclusions attribute as an array
     */
    public function getInclusionsAttribute($value)
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        return is_array($value) ? $value : [];
    }

    /**
     * Get the exclusions attribute as an array
     */
    public function getExclusionsAttribute($value)
    {
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }
        return is_array($value) ? $value : [];
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function getPriceForUser(?User $user = null): float
    {
        if ($user && $user->userType && $user->userType->isB2B() && $user->is_verified) {
            return $this->b2b_price ?? $this->price;
        }
        return $this->price;
    }

    public function getB2BSavings(): float
    {
        if (!$this->b2b_price || $this->b2b_price >= $this->price) {
            return 0;
        }
        return $this->price - $this->b2b_price;
    }

    public function getB2BSavingsPercentage(): int
    {
        if (!$this->b2b_price || $this->b2b_price >= $this->price) {
            return 0;
        }
        return round((($this->price - $this->b2b_price) / $this->price) * 100);
    }

    public function hasB2BDiscount(): bool
    {
        return $this->b2b_price && $this->b2b_price < $this->price;
    }
}
