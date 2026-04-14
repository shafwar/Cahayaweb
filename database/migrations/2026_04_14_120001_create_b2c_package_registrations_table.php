<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('b2c_package_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('b2c_travel_package_id')->constrained('b2c_travel_packages')->restrictOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->string('passport_number');
            $table->text('address');
            $table->date('date_of_birth');
            $table->string('gender', 20);
            $table->string('departure_period_snapshot');
            $table->unsignedInteger('pax')->default(1);
            $table->dateTime('terms_accepted_at');
            $table->timestamps();

            $table->index(['b2c_travel_package_id', 'created_at']);
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('b2c_package_registrations');
    }
};
