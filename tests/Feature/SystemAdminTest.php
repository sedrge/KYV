<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SystemAdminSeeder;
use Illuminate\Support\Facades\Config;

use function Pest\Laravel\artisan;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    Config::set('app.system_admin', [
        'email' => 'admin@test.com',
        'password' => 'TestPassword123!',
        'name' => 'Test System Admin',
        'active' => true,
    ]);
});

test('system admin seeder creates admin with correct attributes', function () {
    $this->seed(RolePermissionSeeder::class);
    $this->seed(SystemAdminSeeder::class);

    assertDatabaseHas('users', [
        'email' => 'admin@test.com',
        'name' => 'Test System Admin',
    ]);

    $admin = User::where('email', 'admin@test.com')->first();
    expect($admin)->not->toBeNull();
    expect($admin->hasRole('Super Admin'))->toBeTrue();
    expect($admin->email_verified_at)->not->toBeNull();
});

test('system admin seeder skips if admin already exists', function () {
    $this->seed(RolePermissionSeeder::class);
    $this->seed(SystemAdminSeeder::class);

    $initialCount = User::count();

    // Run seeder again
    $this->seed(SystemAdminSeeder::class);

    expect(User::count())->toBe($initialCount);
});

test('system admin seeder warns if configuration is incomplete', function () {
    Config::set('app.system_admin.email', null);

    $this->seed(RolePermissionSeeder::class);
    $this->seed(SystemAdminSeeder::class);

    assertDatabaseMissing('users', [
        'email' => 'admin@test.com',
    ]);
});

test('system admin command creates admin successfully', function () {
    $this->seed(RolePermissionSeeder::class);

    artisan('system-admin:ensure')
        ->assertSuccessful()
        ->expectsOutput("System admin 'Test System Admin' created successfully with email 'admin@test.com'.");

    assertDatabaseHas('users', [
        'email' => 'admin@test.com',
        'name' => 'Test System Admin',
    ]);

    $admin = User::where('email', 'admin@test.com')->first();
    expect($admin->hasRole('Super Admin'))->toBeTrue();
});

test('system admin command skips if admin exists without force option', function () {
    $this->seed(RolePermissionSeeder::class);
    $this->seed(SystemAdminSeeder::class);

    artisan('system-admin:ensure')
        ->assertSuccessful()
        ->expectsOutput("System admin with email 'admin@test.com' already exists.");
});

test('system admin command recreates admin with force option', function () {
    $this->seed(RolePermissionSeeder::class);
    $this->seed(SystemAdminSeeder::class);

    $originalAdmin = User::where('email', 'admin@test.com')->first();
    $originalId = $originalAdmin->id;

    artisan('system-admin:ensure --force')
        ->expectsConfirmation("Are you sure you want to recreate the system admin account for 'admin@test.com'?", 'yes')
        ->assertSuccessful();

    $newAdmin = User::where('email', 'admin@test.com')->first();
    expect($newAdmin->id)->not->toBe($originalId);
    expect($newAdmin->hasRole('Super Admin'))->toBeTrue();
});

test('system admin command fails with incomplete configuration', function () {
    Config::set('app.system_admin.email', null);

    artisan('system-admin:ensure')
        ->assertFailed()
        ->expectsOutput('System admin configuration is incomplete.');
});

test('system admin has all permissions', function () {
    $this->seed(RolePermissionSeeder::class);
    $this->seed(SystemAdminSeeder::class);

    $admin = User::where('email', 'admin@test.com')->first();

    expect($admin->isSuperAdmin())->toBeTrue();
    expect($admin->can('view users'))->toBeTrue();
    expect($admin->can('create users'))->toBeTrue();
    expect($admin->can('edit users'))->toBeTrue();
    expect($admin->can('delete users'))->toBeTrue();
    expect($admin->can('view roles'))->toBeTrue();
    expect($admin->can('create roles'))->toBeTrue();
    expect($admin->can('assign permissions'))->toBeTrue();
});

test('system admin seeder respects active flag', function () {
    Config::set('app.system_admin.active', false);

    $this->seed(RolePermissionSeeder::class);
    $this->seed(SystemAdminSeeder::class);

    $admin = User::where('email', 'admin@test.com')->first();
    expect($admin->email_verified_at)->toBeNull();
});

test('system admin password is properly hashed', function () {
    $this->seed(RolePermissionSeeder::class);
    $this->seed(SystemAdminSeeder::class);

    $admin = User::where('email', 'admin@test.com')->first();
    expect($admin->password)->not->toBe('TestPassword123!');
    expect(strlen($admin->password))->toBeGreaterThan(20);
});
