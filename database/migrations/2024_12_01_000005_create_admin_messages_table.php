<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->string('subject');
            $table->text('message');
            $table->enum('type', ['verification', 'purchase', 'general'])->default('general');
            $table->enum('status', ['unread', 'read', 'replied'])->default('unread');
            $table->foreignId('parent_message_id')->nullable()->constrained('admin_messages')->onDelete('cascade'); // For replies
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['admin_id', 'status']);
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_messages');
    }
};
