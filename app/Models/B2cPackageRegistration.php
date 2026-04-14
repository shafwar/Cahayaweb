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
        'terms_accepted_at',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'terms_accepted_at' => 'datetime',
            'pax' => 'integer',
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
}
