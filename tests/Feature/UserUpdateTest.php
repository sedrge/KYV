<?php

use App\Models\Place;
use App\Models\User;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\put;

beforeEach(function () {
    $this->admin = User::factory()->create();
    $this->targetUser = User::factory()->create([
        'email' => 'original@example.com',
    ]);
});

it('can update a user', function () {
    actingAs($this->admin);

    $response = put(route('users.update', $this->targetUser), [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'place_id' => null,
        'roles' => [],
    ]);

    $response->assertRedirect(route('users.index'));

    $this->targetUser->refresh();
    expect($this->targetUser->name)->toBe('Updated Name');
    expect($this->targetUser->email)->toBe('updated@example.com');
});

it('can update a user with same email', function () {
    actingAs($this->admin);

    $response = put(route('users.update', $this->targetUser), [
        'name' => 'Updated Name',
        'email' => 'original@example.com', // Same email
        'place_id' => null,
        'roles' => [],
    ]);

    $response->assertRedirect(route('users.index'));
});

it('cannot update user with existing email', function () {
    $otherUser = User::factory()->create([
        'email' => 'other@example.com',
    ]);

    actingAs($this->admin);

    $response = put(route('users.update', $this->targetUser), [
        'name' => 'Updated Name',
        'email' => 'other@example.com', // Email already taken
        'place_id' => null,
        'roles' => [],
    ]);

    $response->assertSessionHasErrors('email');
});

it('can update a user with password', function () {
    actingAs($this->admin);

    $response = put(route('users.update', $this->targetUser), [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
        'place_id' => null,
        'roles' => [],
    ]);

    $response->assertRedirect(route('users.index'));

    $this->targetUser->refresh();
    expect(Hash::check('newpassword123', $this->targetUser->password))->toBeTrue();
});

it('can update a user with place', function () {
    $place = Place::factory()->create();

    actingAs($this->admin);

    $response = put(route('users.update', $this->targetUser), [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'place_id' => $place->id,
        'roles' => [],
    ]);

    $response->assertRedirect(route('users.index'));

    $this->targetUser->refresh();
    expect($this->targetUser->place_id)->toBe($place->id);
});

it('can update a user with roles', function () {
    $role = Role::create(['name' => 'Admin']);

    actingAs($this->admin);

    $response = put(route('users.update', $this->targetUser), [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'place_id' => null,
        'roles' => ['Admin'],
    ]);

    $response->assertRedirect(route('users.index'));

    $this->targetUser->refresh();
    expect($this->targetUser->hasRole('Admin'))->toBeTrue();
});
