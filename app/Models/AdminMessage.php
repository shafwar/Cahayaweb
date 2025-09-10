<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdminMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'admin_id',
        'subject',
        'message',
        'status',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }



    public function isUnread(): bool
    {
        return $this->status === 'sent';
    }

    public function isRead(): bool
    {
        return $this->status === 'read';
    }

    public function isReplied(): bool
    {
        return $this->status === 'replied';
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeUnread($query)
    {
        return $query->where('status', 'sent');
    }

    public function markAsRead(): void
    {
        $this->update([
            'status' => 'read',
            'read_at' => now(),
        ]);
    }
}
