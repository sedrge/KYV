<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first (required for system admin)
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Create system admin (should be created first)
        $this->call([
            SystemAdminSeeder::class,
        ]);

        // Seed other data
        $this->call([
            TypePlaceSeeder::class,
        ]);

        // Create test user only in non-production environments
        if (! app()->environment('production')) {
            User::firstOrCreate(
                ['email' => 'test@example.com'],
                [
                    'name' => 'Test User',
                    'password' => 'password',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
