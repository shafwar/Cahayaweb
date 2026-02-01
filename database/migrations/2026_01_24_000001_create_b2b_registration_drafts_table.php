<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('b2b_registration_drafts', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->json('payload');
            $table->json('file_paths')->nullable();
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('b2b_registration_drafts');
    }
};
