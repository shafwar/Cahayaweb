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
        Schema::create('agent_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Company Information
            $table->string('company_name');
            $table->string('company_email');
            $table->string('company_phone');
            $table->text('company_address');
            $table->string('company_city');
            $table->string('company_province');
            $table->string('company_postal_code');
            $table->string('company_country')->default('Indonesia');

            // Business Information
            $table->string('business_license_number')->nullable();
            $table->string('tax_id_number')->nullable();
            $table->string('business_type'); // e.g., 'PT', 'CV', 'UD', etc.
            $table->integer('years_in_business')->nullable();
            $table->text('business_description')->nullable();

            // Contact Person
            $table->string('contact_person_name');
            $table->string('contact_person_position');
            $table->string('contact_person_phone');
            $table->string('contact_person_email');

            // Documents (file paths)
            $table->string('business_license_file')->nullable();
            $table->string('tax_certificate_file')->nullable();
            $table->string('company_profile_file')->nullable();

            // Verification Status
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_verifications');
    }
};
