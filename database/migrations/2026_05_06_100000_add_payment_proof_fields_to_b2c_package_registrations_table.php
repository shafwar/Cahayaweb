<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('b2c_package_registrations', function (Blueprint $table) {
            $table->string('payment_proof')->nullable()->after('payment_status');
            $table->text('payment_note')->nullable()->after('payment_proof');
            $table->timestamp('payment_uploaded_at')->nullable()->after('payment_note');
        });
    }

    public function down(): void
    {
        Schema::table('b2c_package_registrations', function (Blueprint $table) {
            $table->dropColumn([
                'payment_proof',
                'payment_note',
                'payment_uploaded_at',
            ]);
        });
    }
};
