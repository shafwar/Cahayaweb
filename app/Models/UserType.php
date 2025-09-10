<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function isAdmin(): bool
    {
        return $this->name === 'admin';
    }

    public function isB2B(): bool
    {
        return $this->name === 'b2b';
    }

    public function isB2C(): bool
    {
        return $this->name === 'b2c';
    }
}
