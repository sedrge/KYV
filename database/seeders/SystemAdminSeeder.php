<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SystemAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $email = config('app.system_admin.email');
        $password = config('app.system_admin.password');
        $name = config('app.system_admin.name');
        $active = config('app.system_admin.active', true);

        // Validate required configuration
        if (! $email || ! $password || ! $name) {
            $this->command->warn('System admin configuration is incomplete. Skipping system admin creation.');
            $this->command->warn('Please set SYSTEM_ADMIN_EMAIL, SYSTEM_ADMIN_PASSWORD, and SYSTEM_ADMIN_NAME in your .env file.');

            return;
        }

        // Check if system admin already exists
        $existingAdmin = User::where('email', $email)->first();

        if ($existingAdmin) {
            $this->command->info("System admin with email '{$email}' already exists. Skipping creation.");

            return;
        }

        // Ensure Super Admin role exists
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);

        // Create the system admin
        $systemAdmin = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => $active ? now() : null,
        ]);

        // Assign Super Admin role
        $systemAdmin->assignRole($superAdminRole);

        $this->command->info("System admin '{$name}' created successfully with email '{$email}'.");
        $this->command->warn('IMPORTANT: Please change the default password immediately after first login!');
    }
}
