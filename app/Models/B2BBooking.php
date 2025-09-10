<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class B2BBooking extends Model
{
    use HasFactory;

    protected $table = 'b2b_bookings';

    protected $fillable = [
        'booking_reference',
        'invoice_number',
        'partner_id',
        'package_id',
        'travelers_count',
        'total_amount',
        'b2b_discount',
        'final_amount',
        'currency',
        'status',
        'status_history',
        'payment_proof',
        'admin_notes',
        'invoice_url',
        'invoice_pdf_path',
        'traveler_details',
        'special_requests',
        'processed_by',
        'processed_at',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'b2b_discount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'status_history' => 'array',
        'traveler_details' => 'array',
        'special_requests' => 'array',
        'processed_at' => 'datetime',
    ];

    // Relationships
    public function partner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'partner_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    // Boot method to generate references
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (empty($booking->booking_reference)) {
                $booking->booking_reference = self::generateBookingReference();
            }
            if (empty($booking->invoice_number)) {
                $booking->invoice_number = self::generateInvoiceNumber();
            }
        });
    }

    // Generate unique booking reference
    public static function generateBookingReference(): string
    {
        do {
            $date = now()->format('Ymd');
            $random = strtoupper(Str::random(4));
            $reference = "CA-B2B-{$date}-{$random}";
        } while (self::where('booking_reference', $reference)->exists());

        return $reference;
    }

    // Generate unique invoice number
    public static function generateInvoiceNumber(): string
    {
        do {
            $date = now()->format('Ymd');
            $random = strtoupper(Str::random(4));
            $invoice = "INV-CA-{$date}-{$random}";
        } while (self::where('invoice_number', $invoice)->exists());

        return $invoice;
    }

    // Status helpers
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    // Status progression methods with history tracking
    public function updateStatus(string $newStatus, ?int $adminId = null, ?string $notes = null): void
    {
        $oldStatus = $this->status;

        // Add to status history
        $history = $this->status_history ?? [];
        $history[] = [
            'from_status' => $oldStatus,
            'to_status' => $newStatus,
            'admin_id' => $adminId,
            'notes' => $notes,
            'timestamp' => now()->toISOString(),
        ];

        $this->update([
            'status' => $newStatus,
            'status_history' => $history,
            'processed_by' => $adminId,
            'processed_at' => now(),
            'admin_notes' => $notes ? ($this->admin_notes . "\n" . now()->format('Y-m-d H:i') . " - " . $notes) : $this->admin_notes,
        ]);
    }

    public function markConfirmed(int $adminId, ?string $notes = null): void
    {
        $this->updateStatus('confirmed', $adminId, $notes);
    }

    public function markRejected(int $adminId, ?string $notes = null): void
    {
        $this->updateStatus('rejected', $adminId, $notes);
    }

    public function uploadPaymentProof(string $proofPath): void
    {
        $this->update([
            'payment_proof' => $proofPath,
        ]);
    }

    // Get status history for timeline display
    public function getStatusHistory(): array
    {
        return $this->status_history ?? [];
    }

    // Get latest status change
    public function getLatestStatusChange(): ?array
    {
        $history = $this->getStatusHistory();
        return !empty($history) ? end($history) : null;
    }

    // Get formatted amount
    public function getFormattedAmount(): string
    {
        return 'Rp ' . number_format($this->final_amount, 0, ',', '.');
    }

    // Get status badge color
    public function getStatusColor(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'confirmed' => 'green',
            'rejected' => 'red',
            default => 'gray'
        };
    }

    // Get status display name
    public function getStatusDisplay(): string
    {
        return match($this->status) {
            'pending' => 'Pending Payment',
            'confirmed' => 'Confirmed',
            'rejected' => 'Rejected',
            default => 'Unknown'
        };
    }
}
