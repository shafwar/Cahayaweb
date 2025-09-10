<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->string('destination');
            $table->integer('duration_days');
            $table->decimal('price', 12, 2);
            $table->decimal('b2b_price', 12, 2)->nullable(); // Special price for B2B
            $table->string('image_path')->nullable();
            $table->json('highlights')->nullable(); // Array of highlights
            $table->json('inclusions')->nullable(); // Array of inclusions
            $table->json('exclusions')->nullable(); // Array of exclusions
            $table->enum('type', ['umrah', 'hajj', 'vacation', 'business'])->default('vacation');
            $table->boolean('is_active')->default(true);
            $table->integer('max_capacity')->nullable();
            $table->date('departure_date')->nullable();
            $table->timestamps();

            $table->index(['type', 'is_active']);
            $table->index('destination');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
