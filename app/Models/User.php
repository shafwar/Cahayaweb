<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type_id',
        'is_verified',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    // Relationships
    public function userType(): BelongsTo
    {
        return $this->belongsTo(UserType::class);
    }

    public function b2bVerification(): HasOne
    {
        return $this->hasOne(B2BVerification::class);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function adminMessages(): HasMany
    {
        return $this->hasMany(AdminMessage::class);
    }

    public function approvedVerifications(): HasMany
    {
        return $this->hasMany(B2BVerification::class, 'approved_by');
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->userType && $this->userType->isAdmin();
    }

    public function isB2B(): bool
    {
        return $this->userType && $this->userType->isB2B();
    }

    public function isB2C(): bool
    {
        return $this->userType && $this->userType->isB2C();
    }

    public function isVerified(): bool
    {
        // For B2B users, check B2B verification status
        if ($this->isB2B()) {
            return $this->b2bVerification && $this->b2bVerification->status === 'approved';
        }

        // For other users, use the is_verified field
        return $this->is_verified;
    }

    public function canAccessPackages(): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        if ($this->isB2B()) {
            return $this->isVerified();
        }

        if ($this->isB2C()) {
            return true;
        }

        return false;
    }

    public function updateLastLogin(): void
    {
        $this->update(['last_login_at' => now()]);
    }
}
