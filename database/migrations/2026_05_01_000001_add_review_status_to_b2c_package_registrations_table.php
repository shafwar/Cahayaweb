<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('b2c_package_registrations', function (Blueprint $table) {
            $table->string('registration_status', 20)->default('pending')->after('pax');
            $table->string('payment_status', 30)->default('unpaid')->after('registration_status');
            $table->string('visa_status', 30)->default('not_processed')->after('payment_status');
            $table->string('ticket_status', 30)->default('not_booked')->after('visa_status');
            $table->string('hotel_status', 30)->default('not_assigned')->after('ticket_status');
            $table->foreignId('reviewed_by')->nullable()->after('hotel_status')->constrained('users')->nullOnDelete();
            $table->dateTime('reviewed_at')->nullable()->after('reviewed_by');
            $table->text('notes')->nullable()->after('reviewed_at');

            $table->index(['registration_status', 'created_at']);
            $table->index(['payment_status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('b2c_package_registrations', function (Blueprint $table) {
            $table->dropIndex(['registration_status', 'created_at']);
            $table->dropIndex(['payment_status', 'created_at']);
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn([
                'registration_status',
                'payment_status',
                'visa_status',
                'ticket_status',
                'hotel_status',
                'reviewed_at',
                'notes',
            ]);
        });
    }
};

