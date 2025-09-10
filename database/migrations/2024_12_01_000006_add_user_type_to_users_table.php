<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('user_type_id')->nullable()->constrained()->after('id');
            $table->boolean('is_verified')->default(false)->after('email_verified_at');
            $table->timestamp('last_login_at')->nullable()->after('is_verified');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['user_type_id']);
            $table->dropColumn(['user_type_id', 'is_verified', 'last_login_at']);
        });
    }
};
