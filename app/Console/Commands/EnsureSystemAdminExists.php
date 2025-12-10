<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class EnsureSystemAdminExists extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system-admin:ensure {--force : Force creation even if admin exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ensure the system administrator account exists';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = config('app.system_admin.email');
        $password = config('app.system_admin.password');
        $name = config('app.system_admin.name');
        $active = config('app.system_admin.active', true);

        // Validate required configuration
        if (! $email || ! $password || ! $name) {
            $this->error('System admin configuration is incomplete.');
            $this->warn('Please set SYSTEM_ADMIN_EMAIL, SYSTEM_ADMIN_PASSWORD, and SYSTEM_ADMIN_NAME in your .env file.');

            return self::FAILURE;
        }

        // Check if system admin already exists
        $existingAdmin = User::where('email', $email)->first();

        if ($existingAdmin && ! $this->option('force')) {
            $this->info("System admin with email '{$email}' already exists.");
            $this->info('Use --force option to recreate the admin account.');

            return self::SUCCESS;
        }

        if ($existingAdmin && $this->option('force')) {
            if (! $this->confirm("Are you sure you want to recreate the system admin account for '{$email}'?")) {
                $this->info('Operation cancelled.');

                return self::SUCCESS;
            }

            $existingAdmin->delete();
            $this->warn("Deleted existing system admin account for '{$email}'.");
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

        $this->info("System admin '{$name}' created successfully with email '{$email}'.");
        $this->warn('IMPORTANT: Please change the default password immediately after first login!');

        return self::SUCCESS;
    }
}
