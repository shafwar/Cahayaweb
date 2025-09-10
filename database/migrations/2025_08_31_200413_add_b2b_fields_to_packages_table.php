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
        Schema::table('packages', function (Blueprint $table) {
            $table->json('itinerary')->nullable()->after('exclusions');
            $table->integer('max_travelers')->default(10)->after('max_capacity');
            $table->date('return_date')->nullable()->after('departure_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn(['itinerary', 'max_travelers', 'return_date']);
        });
    }
};
