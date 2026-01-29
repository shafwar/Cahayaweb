<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class B2BRegistrationDraft extends Model
{
    protected $table = 'b2b_registration_drafts';

    protected $fillable = [
        'token',
        'payload',
        'file_paths',
        'expires_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'file_paths' => 'array',
        'expires_at' => 'datetime',
    ];

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}
