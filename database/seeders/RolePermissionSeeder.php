<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create base permissions
        $permissions = [
            // User management
            'view users',
            'create users',
            'edit users',
            'delete users',
            'search users',

            // Organization management
            'view organizations',
            'create organizations',
            'edit organizations',
            'delete organizations',
            'manage own organization',

            // Place management
            'view places',
            'create places',
            'edit places',
            'delete places',
            'manage own place',

            // Visitor management
            'view visitors',
            'create visitors',
            'edit visitors',
            'delete visitors',
            'search visitors',

            // Role & Permission management
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'assign roles',
            'view permissions',
            'assign permissions',

            // Configuration management
            'view configs',
            'create configs',
            'edit configs',
            'delete configs',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions

        // Super Admin - All permissions
        $superAdmin = Role::create(['name' => 'Super Admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // Autorités - Limited search and view
        $autorites = Role::create(['name' => 'Autorités']);
        $autorites->givePermissionTo([
            'view users',
            'search users',
            'view visitors',
            'search visitors',
            'view organizations',
            'view places',
        ]);

        // Admin - Full control within organization
        $admin = Role::create(['name' => 'Admin']);
        $admin->givePermissionTo([
            'view users',
            'create users',
            'edit users',
            'delete users',
            'manage own organization',
            'view places',
            'create places',
            'edit places',
            'delete places',
            'view visitors',
            'create visitors',
            'edit visitors',
            'delete visitors',
            'view configs',
            'edit configs',
            'assign roles',
        ]);

        // Investigator
        $investigator = Role::create(['name' => 'Investigator']);
        $investigator->givePermissionTo([
            'view users',
            'search users',
            'view visitors',
            'search visitors',
            'view places',
            'view organizations',
        ]);

        // Host - Manage reception place
        $host = Role::create(['name' => 'Host']);
        $host->givePermissionTo([
            'view visitors',
            'create visitors',
            'edit visitors',
            'manage own place',
            'view users',
        ]);

        // Agent - Basic operations
        $agent = Role::create(['name' => 'Agent']);
        $agent->givePermissionTo([
            'view visitors',
            'create visitors',
            'edit visitors',
            'view places',
        ]);

        // Visitor - Minimal permissions
        $visitor = Role::create(['name' => 'Visitor']);
        $visitor->givePermissionTo([
            'view places',
        ]);
    }
}
