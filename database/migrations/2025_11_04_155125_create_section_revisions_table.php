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
        Schema::create('section_revisions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('section_id');
            $table->string('key');
            $table->text('content')->nullable();
            $table->string('image')->nullable();
            $table->string('changed_by')->nullable(); // Admin email who made the change
            $table->string('change_type')->default('update'); // create, update, restore
            $table->timestamps();

            $table->index('section_id');
            $table->index('key');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section_revisions');
    }
};
