<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserType;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run user types seeder first
        $this->call([
            UserTypeSeeder::class,
            PackageSeeder::class,
        ]);

        // Create admin user if not exists
        $adminType = UserType::where('name', 'admin')->first();

        if (!User::where('email', 'admin@cahayaanbiya.com')->exists()) {
            User::create([
                'name' => 'Admin Cahaya Anbiya',
                'email' => 'admin@cahayaanbiya.com',
                'password' => Hash::make('admin123'),
                'user_type_id' => $adminType->id,
                'is_verified' => true,
                'email_verified_at' => now(),
            ]);
        }

        // Create test B2B user if not exists
        $b2bType = UserType::where('name', 'b2b')->first();

        if (!User::where('email', 'b2b@test.com')->exists()) {
            User::create([
                'name' => 'Test B2B User',
                'email' => 'b2b@test.com',
                'password' => Hash::make('password'),
                'user_type_id' => $b2bType->id,
                'is_verified' => false,
            ]);
        }

        // Create test B2C user if not exists
        $b2cType = UserType::where('name', 'b2c')->first();

        if (!User::where('email', 'b2c@test.com')->exists()) {
            User::create([
                'name' => 'Test B2C User',
                'email' => 'b2c@test.com',
                'password' => Hash::make('password'),
                'user_type_id' => $b2cType->id,
                'is_verified' => true,
            ]);
        }
    }
}
