<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Drafts persist B2B form data across requests so flow works when session
     * is lost (e.g. multi-instance with file session driver).
     */
    public function up(): void
    {
        Schema::create('b2b_registration_drafts', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->json('payload'); // form data (no files)
            $table->json('file_paths')->nullable(); // paths on R2/public: temp-b2b-drafts/{token}/...
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index('token');
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b2b_registration_drafts');
    }
};
