<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('b2b_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique(); // CA-B2B-YYYYMMDD-XXXX
            $table->string('invoice_number')->unique(); // INV-CA-YYYYMMDD-XXXX
            $table->foreignId('partner_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('package_id')->constrained('packages')->onDelete('cascade');

            // Booking Details
            $table->integer('travelers_count')->default(1);
            $table->decimal('total_amount', 15, 2);
            $table->decimal('b2b_discount', 15, 2)->default(0);
            $table->decimal('final_amount', 15, 2);
            $table->string('currency', 3)->default('IDR');

            // Status Management
            $table->enum('status', [
                'pending',      // Initial booking created, awaiting payment
                'confirmed',    // Payment verified, booking confirmed
                'rejected'      // Booking rejected by admin
            ])->default('pending');

            // Status History & Payment
            $table->json('status_history')->nullable();
            $table->string('payment_proof')->nullable();

            // Invoice & Payment
            $table->string('invoice_url')->nullable();
            $table->string('invoice_pdf_path')->nullable();

            // Travel Details
            $table->json('traveler_details')->nullable(); // Array of traveler info
            $table->json('special_requests')->nullable();
            $table->text('admin_notes')->nullable();

            // Communication (Email is primary, WhatsApp secondary)
            $table->json('email_notifications')->nullable(); // Track email notifications
            $table->json('whatsapp_messages')->nullable(); // Track WhatsApp interactions

            // Admin Management
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->timestamp('processed_at')->nullable();

            $table->timestamps();

            // Indexes for performance
            $table->index(['partner_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index('booking_reference');
            $table->index('invoice_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b2b_bookings');
    }
};
