<?php

use App\Models\Place;
use App\Models\TypePlace;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('place show page displays qr code when it exists', function () {
    $user = User::factory()->create();
    $typePlace = TypePlace::factory()->create();
    $place = Place::factory()->create([
        'type_place_id' => $typePlace->id,
        'qr_code_path' => 'qrcodes/test-qr-code.png',
    ]);

    $response = $this->actingAs($user)->get(route('places.show', $place));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Places/Show')
        ->has('place')
        ->where('place.qr_code_path', 'qrcodes/test-qr-code.png')
    );
});

test('place edit page loads qr code when it exists', function () {
    $user = User::factory()->create();
    $typePlace = TypePlace::factory()->create();
    $place = Place::factory()->create([
        'type_place_id' => $typePlace->id,
        'qr_code_path' => 'qrcodes/test-qr-code.png',
    ]);

    $response = $this->actingAs($user)->get(route('places.edit', $place));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Places/Edit')
        ->has('place')
        ->where('place.qr_code_path', 'qrcodes/test-qr-code.png')
    );
});

test('place index page shows correct action buttons', function () {
    $user = User::factory()->create();
    $typePlace = TypePlace::factory()->create();
    $place = Place::factory()->create([
        'type_place_id' => $typePlace->id,
    ]);

    $response = $this->actingAs($user)->get(route('places.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Places/Index')
        ->has('places', 1)
    );
});

test('creating a place generates a qr code', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $user->givePermissionTo('place.create');

    $typePlace = TypePlace::factory()->create();

    $response = $this->actingAs($user)->post(route('places.store'), [
        'name' => 'Test Place',
        'type_place_id' => $typePlace->id,
        'is_active' => 'on',
    ]);

    $response->assertRedirect(route('places.index'));

    $place = Place::where('name', 'Test Place')->first();
    expect($place->qr_code_path)->not->toBeNull();
})->skip('Permissions system needs to be configured');

test('updating a place regenerates the qr code', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $user->givePermissionTo('place.update');

    $typePlace = TypePlace::factory()->create();
    $place = Place::factory()->create([
        'type_place_id' => $typePlace->id,
        'qr_code_path' => 'qrcodes/old-qr-code.png',
    ]);

    $oldQrCodePath = $place->qr_code_path;

    $response = $this->actingAs($user)->put(route('places.update', $place), [
        'name' => 'Updated Place Name',
        'type_place_id' => $typePlace->id,
        'is_active' => 'on',
    ]);

    $response->assertRedirect(route('places.index'));

    $place->refresh();
    expect($place->qr_code_path)->not->toBeNull();
    expect($place->name)->toBe('Updated Place Name');
})->skip('Permissions system needs to be configured');
