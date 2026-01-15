<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentVerification extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'company_email',
        'company_phone',
        'company_address',
        'company_city',
        'company_province',
        'company_postal_code',
        'company_country',
        'business_license_number',
        'tax_id_number',
        'business_type',
        'business_type_other',
        'years_in_business',
        'business_description',
        'contact_person_name',
        'contact_person_position',
        'contact_person_phone',
        'contact_person_email',
        'business_license_file',
        'tax_certificate_file',
        'company_profile_file',
        'status',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'years_in_business' => 'integer',
    ];

    /**
     * Get the user that owns this verification
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin who reviewed this verification
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Check if verification is approved
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if verification is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if verification is rejected
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
}
