<?php

use App\Models\Place;
use App\Models\TypePlace;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Storage::fake('public');

    Permission::create(['name' => 'create places']);
    Permission::create(['name' => 'edit places']);
    Permission::create(['name' => 'delete places']);
    Permission::create(['name' => 'view places']);

    $superAdminRole = Role::create(['name' => 'Super Admin']);
    $superAdminRole->givePermissionTo(['create places', 'edit places', 'delete places', 'view places']);

    $this->user = User::factory()->create();
    $this->user->assignRole('Super Admin');
    $this->actingAs($this->user);
});

test('place can be created with qr code', function () {
    $typePlace = TypePlace::factory()->create();

    $placeData = [
        'name' => 'Test Place',
        'type_place_id' => $typePlace->id,
        'address' => 'Test Address',
        'city' => 'Test City',
        'phone' => '+1234567890',
        'email' => 'test@example.com',
        'latitude' => '12.34',
        'longitude' => '56.78',
        'website' => 'https://example.com',
        'rating' => '4.5',
        'description' => 'Test Description',
        'is_active' => 'on',
    ];

    $response = $this->post(route('places.store'), $placeData);

    $response->assertRedirect(route('places.index'));
    $response->assertSessionHas('success');

    $place = Place::latest()->first();
    expect($place)->not->toBeNull();
    expect($place->name)->toBe('Test Place');
    expect($place->qr_code_path)->not->toBeNull();

    Storage::disk('public')->assertExists($place->qr_code_path);
});

test('qr code is regenerated when place is updated', function () {
    $typePlace = TypePlace::factory()->create();

    $placeData = [
        'name' => 'Original Place',
        'type_place_id' => $typePlace->id,
        'address' => 'Original Address',
        'city' => 'Original City',
        'phone' => '+1234567890',
        'email' => 'original@example.com',
        'latitude' => '12.34',
        'longitude' => '56.78',
        'website' => 'https://example.com',
        'rating' => '4.5',
        'description' => 'Original Description',
        'is_active' => 'on',
    ];

    $this->post(route('places.store'), $placeData);
    $place = Place::latest()->first();

    $updateData = [
        'name' => 'Updated Place Name',
        'type_place_id' => $typePlace->id,
        'address' => $place->address,
        'city' => $place->city,
        'phone' => $place->phone,
        'email' => $place->email,
        'latitude' => $place->latitude,
        'longitude' => $place->longitude,
        'website' => $place->website,
        'rating' => $place->rating,
        'description' => $place->description,
        'is_active' => 'on',
    ];

    $response = $this->put(route('places.update', $place), $updateData);

    $response->assertRedirect(route('places.index'));

    $place->refresh();
    expect($place->name)->toBe('Updated Place Name');
    expect($place->qr_code_path)->not->toBeNull();

    Storage::disk('public')->assertExists($place->qr_code_path);
});

test('qr code is deleted when place is deleted', function () {
    $typePlace = TypePlace::factory()->create();

    $placeData = [
        'name' => 'Place to Delete',
        'type_place_id' => $typePlace->id,
        'address' => 'Delete Address',
        'city' => 'Delete City',
        'phone' => '+1234567890',
        'email' => 'delete@example.com',
        'latitude' => '12.34',
        'longitude' => '56.78',
        'website' => 'https://example.com',
        'rating' => '4.5',
        'description' => 'Delete Description',
        'is_active' => 'on',
    ];

    $this->post(route('places.store'), $placeData);
    $place = Place::latest()->first();
    $qrCodePath = $place->qr_code_path;

    $response = $this->delete(route('places.destroy', $place));

    $response->assertRedirect(route('places.index'));

    expect(Place::find($place->id))->toBeNull();
});
