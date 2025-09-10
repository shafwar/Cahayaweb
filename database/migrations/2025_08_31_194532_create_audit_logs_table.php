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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('action', ['approve', 'reject', 'update', 'delete']);
            $table->string('model_type')->nullable(); // For future extensibility
            $table->unsignedBigInteger('model_id')->nullable(); // For future extensibility
            $table->text('reason')->nullable();
            $table->json('metadata')->nullable(); // For additional data
            $table->timestamps();

            // Indexes for better performance
            $table->index(['admin_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
