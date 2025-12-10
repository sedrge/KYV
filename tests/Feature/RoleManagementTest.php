<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    $this->user = User::factory()->create();
});

test('can create a new role', function () {
    $permission = Permission::create(['name' => 'test permission']);

    actingAs($this->user)
        ->from(route('roles.create'))
        ->post(route('roles.store'), [
            'name' => 'New Role',
            'permissions' => ['test permission'],
        ])
        ->assertRedirect(route('roles.index'));

    assertDatabaseHas('roles', ['name' => 'New Role']);

    $role = Role::where('name', 'New Role')->first();
    expect($role->hasPermissionTo('test permission'))->toBeTrue();
});

test('can update an existing role', function () {
    $role = Role::create(['name' => 'Old Role']);
    $permission = Permission::create(['name' => 'updated permission']);

    actingAs($this->user)
        ->from(route('roles.edit', $role))
        ->put(route('roles.update', $role), [
            'name' => 'Updated Role',
            'permissions' => ['updated permission'],
        ])
        ->assertRedirect(route('roles.index'));

    assertDatabaseHas('roles', ['name' => 'Updated Role']);
    assertDatabaseMissing('roles', ['name' => 'Old Role']);

    $role->refresh();
    expect($role->hasPermissionTo('updated permission'))->toBeTrue();
});

test('can delete a role without users', function () {
    $role = Role::create(['name' => 'Deletable Role']);

    actingAs($this->user)
        ->from(route('roles.index'))
        ->delete(route('roles.destroy', $role))
        ->assertRedirect(route('roles.index'));

    assertDatabaseMissing('roles', ['name' => 'Deletable Role']);
});

test('cannot delete a role assigned to users', function () {
    $role = Role::create(['name' => 'Assigned Role']);
    $this->user->assignRole($role);

    actingAs($this->user)
        ->from(route('roles.index'))
        ->delete(route('roles.destroy', $role))
        ->assertRedirect();

    assertDatabaseHas('roles', ['name' => 'Assigned Role']);
});

test('user can be assigned multiple roles', function () {
    $role1 = Role::create(['name' => 'Role 1']);
    $role2 = Role::create(['name' => 'Role 2']);

    $this->user->assignRole([$role1, $role2]);

    expect($this->user->hasRole('Role 1'))->toBeTrue();
    expect($this->user->hasRole('Role 2'))->toBeTrue();
    expect($this->user->roles)->toHaveCount(2);
});

test('user inherits permissions from multiple roles', function () {
    $permission1 = Permission::create(['name' => 'permission 1']);
    $permission2 = Permission::create(['name' => 'permission 2']);

    $role1 = Role::create(['name' => 'Role 1']);
    $role1->givePermissionTo($permission1);

    $role2 = Role::create(['name' => 'Role 2']);
    $role2->givePermissionTo($permission2);

    $this->user->assignRole([$role1, $role2]);

    expect($this->user->hasPermissionTo('permission 1'))->toBeTrue();
    expect($this->user->hasPermissionTo('permission 2'))->toBeTrue();
});

test('role name is required when creating', function () {
    actingAs($this->user)
        ->from(route('roles.create'))
        ->post(route('roles.store'), [
            'name' => '',
        ])
        ->assertSessionHasErrors('name');
});

test('role name must be unique', function () {
    Role::create(['name' => 'Existing Role']);

    actingAs($this->user)
        ->from(route('roles.create'))
        ->post(route('roles.store'), [
            'name' => 'Existing Role',
        ])
        ->assertSessionHasErrors('name');
});
