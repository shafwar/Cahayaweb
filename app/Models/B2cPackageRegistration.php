<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class B2cPackageRegistration extends Model
{
    protected $fillable = [
        'b2c_travel_package_id',
        'user_id',
        'full_name',
        'email',
        'phone',
        'passport_number',
        'address',
        'date_of_birth',
        'gender',
        'departure_period_snapshot',
        'pax',
        'registration_status',
        'payment_status',
        'visa_status',
        'ticket_status',
        'hotel_status',
        'reviewed_by',
        'reviewed_at',
        'notes',
        'terms_accepted_at',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'terms_accepted_at' => 'datetime',
            'pax' => 'integer',
            'reviewed_at' => 'datetime',
        ];
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(B2cTravelPackage::class, 'b2c_travel_package_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function isApproved(): bool
    {
        return $this->registration_status === 'approved';
    }

    public function isPending(): bool
    {
        return $this->registration_status === 'pending';
    }

    public function isRejected(): bool
    {
        return $this->registration_status === 'rejected';
    }
}
