<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class B2cPackageRegistration extends Model
{
    /**
     * Before a user row is deleted, DB will CASCADE-delete linked registrations. That bypasses
     * admin delete logic that decrements b2c_travel_packages.pax_booked — run this from User::deleting.
     */
    public static function releasePaxBookedSummariesForUserId(int $userId): void
    {
        if ($userId <= 0) {
            return;
        }

        DB::transaction(function () use ($userId) {
            $aggregates = static::query()
                ->where('user_id', $userId)
                ->selectRaw('b2c_travel_package_id, SUM(pax) as total_pax')
                ->groupBy('b2c_travel_package_id')
                ->get();

            foreach ($aggregates as $row) {
                $pkg = B2cTravelPackage::query()
                    ->whereKey($row->b2c_travel_package_id)
                    ->lockForUpdate()
                    ->first();

                if ($pkg !== null) {
                    $delta = (int) $row->total_pax;
                    $pkg->forceFill([
                        'pax_booked' => max(0, $pkg->pax_booked - $delta),
                    ])->save();
                }
            }
        });
    }

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
        'payment_proof',
        'payment_note',
        'payment_uploaded_at',
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
            'payment_uploaded_at' => 'datetime',
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
