<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'admin_id',
        'user_id',
        'action',
        'model_type',
        'model_id',
        'reason',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the admin who performed the action.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Get the user who was affected by the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope to filter by action type.
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope to filter by admin.
     */
    public function scopeByAdmin($query, int $adminId)
    {
        return $query->where('admin_id', $adminId);
    }

    /**
     * Scope to filter by user.
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Get the action label for display.
     */
    public function getActionLabelAttribute(): string
    {
        return match ($this->action) {
            'approve' => 'Approved',
            'reject' => 'Rejected',
            'update' => 'Updated',
            'delete' => 'Deleted',
            default => ucfirst($this->action),
        };
    }

    /**
     * Get the action color for UI display.
     */
    public function getActionColorAttribute(): string
    {
        return match ($this->action) {
            'approve' => 'green',
            'reject' => 'red',
            'update' => 'blue',
            'delete' => 'red',
            default => 'gray',
        };
    }
}
