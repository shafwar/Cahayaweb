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
        return $this->agentVerification && $this->agentVerification->isApproved();
    }

    /**
     * Check if user has pending B2B verification
     */
    public function hasPendingB2BVerification(): bool
    {
        return $this->agentVerification && $this->agentVerification->isPending();
    }
}
