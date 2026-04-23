<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agent_verifications', function (Blueprint $table) {
            $table->unsignedInteger('resubmission_count')->default(0)->after('status');
            $table->timestamp('last_resubmitted_at')->nullable()->after('resubmission_count');
        });
    }

    public function down(): void
    {
        Schema::table('agent_verifications', function (Blueprint $table) {
            $table->dropColumn(['resubmission_count', 'last_resubmitted_at']);
        });
    }
};
