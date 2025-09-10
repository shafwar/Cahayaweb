<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('user_types')->insert([
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'System administrator with full access',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'b2b',
                'display_name' => 'Business',
                'description' => 'Business users requiring verification',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'b2c',
                'display_name' => 'Customer',
                'description' => 'Individual customers',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
