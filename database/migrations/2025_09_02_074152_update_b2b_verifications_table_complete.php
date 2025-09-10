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
        Schema::table('b2b_verifications', function (Blueprint $table) {
            // Add approval fields if they don't exist
            if (!Schema::hasColumn('b2b_verifications', 'approved_at')) {
                $table->timestamp('approved_at')->nullable();
            }
            if (!Schema::hasColumn('b2b_verifications', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('b2b_verifications', 'rejected_at')) {
                $table->timestamp('rejected_at')->nullable();
            }
            if (!Schema::hasColumn('b2b_verifications', 'rejected_by')) {
                $table->foreignId('rejected_by')->nullable()->constrained('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('b2b_verifications', 'pending_at')) {
                $table->timestamp('pending_at')->nullable();
            }
            if (!Schema::hasColumn('b2b_verifications', 'pending_by')) {
                $table->foreignId('pending_by')->nullable()->constrained('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('b2b_verifications', 'admin_notes')) {
                $table->text('admin_notes')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('b2b_verifications', function (Blueprint $table) {
            $table->dropForeign(['approved_by', 'rejected_by', 'pending_by']);
            $table->dropColumn(['approved_at', 'approved_by', 'rejected_at', 'rejected_by', 'pending_at', 'pending_by', 'admin_notes']);
        });
    }
};
