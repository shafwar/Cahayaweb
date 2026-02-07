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
        Schema::table('sections', function (Blueprint $table) {
            $table->string('video')->nullable()->after('image');
        });

        Schema::table('section_revisions', function (Blueprint $table) {
            $table->string('video')->nullable()->after('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            $table->dropColumn('video');
        });

        Schema::table('section_revisions', function (Blueprint $table) {
            $table->dropColumn('video');
        });
    }
};
