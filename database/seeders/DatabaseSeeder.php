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

        if ($admin->wasRecentlyCreated) {
            $this->command->info("✅ Admin user created successfully!");
            $this->command->info("   Email: {$adminEmail}");
            $this->command->info("   Password: {$adminPassword}");
        } else {
            // Update password if user already exists
            $admin->password = Hash::make($adminPassword);
            $admin->save();
            $this->command->info("✅ Admin user password updated!");
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
    }
}
