<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
        ];
    }

    /**
     * Get the agent verification for this user
     */
    public function agentVerification()
    {
        return $this->hasOne(AgentVerification::class);
    }

    /**
     * Check if user has B2B access (approved verification)
     */
    public function hasB2BAccess(): bool
    {
        try {
            // Use relationship method to safely check if verification exists
            $verification = $this->agentVerification;
            return $verification && $verification->isApproved();
        } catch (\Throwable $e) {
            // If any error occurs (e.g., relationship not loaded, database error), return false
            \Log::debug('Error checking B2B access', [
                'user_id' => $this->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Check if user has pending B2B verification
     */
    public function hasPendingB2BVerification(): bool
    {
        try {
            // Use relationship method to safely check if verification exists
            $verification = $this->agentVerification;
            return $verification && $verification->isPending();
        } catch (\Throwable $e) {
            // If any error occurs, return false
            \Log::debug('Error checking pending B2B verification', [
                'user_id' => $this->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
