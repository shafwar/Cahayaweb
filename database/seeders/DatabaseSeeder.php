<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        try {
            // Wait for database connection to be ready (retry up to 5 times)
            $maxRetries = 5;
            $retryDelay = 2; // seconds
            
            for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
                try {
                    // Test database connection
                    \DB::connection()->getPdo();
                    break; // Connection successful
                } catch (\PDOException $e) {
                    if ($attempt === $maxRetries) {
                        // Last attempt failed, log and exit gracefully
                        if ($this->command) {
                            $this->command->warn("⚠️  Database connection failed after {$maxRetries} attempts. Skipping seeder.");
                            $this->command->warn("   Error: " . $e->getMessage());
                        }
                        return; // Exit gracefully without crashing
                    }
                    
                    if ($this->command) {
                        $this->command->warn("⚠️  Database connection attempt {$attempt}/{$maxRetries} failed. Retrying in {$retryDelay}s...");
                    }
                    sleep($retryDelay);
                }
            }

            // Create admin user
            $adminEmail = 'admin@cahayaweb.com';
            $adminPassword = 'Admin123!';

            $admin = User::firstOrCreate(
                ['email' => $adminEmail],
                [
                    'name' => 'Admin Cahaya Anbiya',
                    'email' => $adminEmail,
                    'password' => Hash::make($adminPassword),
                    'email_verified_at' => now(),
                ]
            );

            // Always update password to ensure it's set correctly (for Railway deployment)
            if (!$admin->wasRecentlyCreated) {
                $admin->password = Hash::make($adminPassword);
                $admin->save();
            }

            if ($this->command) {
                if ($admin->wasRecentlyCreated) {
                    $this->command->info("✅ Admin user created successfully!");
                } else {
                    $this->command->info("✅ Admin user already exists, password updated!");
                }
                $this->command->info("   Email: {$adminEmail}");
                $this->command->info("   Password: {$adminPassword}");
            }

            // Create test user
            User::firstOrCreate(
                ['email' => 'test@example.com'],
                [
                    'name' => 'Test User',
                    'email' => 'test@example.com',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
        } catch (\PDOException $e) {
            // Database connection error - don't crash, just log
            if ($this->command) {
                $this->command->error("❌ Database error during seeding: " . $e->getMessage());
                $this->command->warn("⚠️  Seeder skipped. Application will continue without seeding.");
            }
            \Log::warning('DatabaseSeeder failed', [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            // Don't throw - let application continue
        } catch (\Throwable $e) {
            // Any other error - don't crash, just log
            if ($this->command) {
                $this->command->error("❌ Error during seeding: " . $e->getMessage());
                $this->command->warn("⚠️  Seeder skipped. Application will continue.");
            }
            \Log::error('DatabaseSeeder failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            // Don't throw - let application continue
        }
    }
}
