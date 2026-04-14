<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('b2c_travel_packages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('package_code')->unique();
            $table->string('name');
            $table->string('departure_period');
            $table->text('description');
            $table->string('location')->nullable();
            $table->string('duration_label')->nullable();
            $table->string('package_type')->default('Religious');
            $table->string('price_display');
            $table->unsignedInteger('pax_capacity');
            $table->unsignedInteger('pax_booked')->default(0);
            $table->dateTime('registration_deadline');
            $table->text('terms_and_conditions');
            $table->string('status', 20)->default('open');
            $table->string('image_path')->nullable();
            $table->json('highlights_json')->nullable();
            $table->json('features_json')->nullable();
            $table->json('dates_json')->nullable();
            $table->json('hotels_json')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('b2c_travel_packages');
    }
};
