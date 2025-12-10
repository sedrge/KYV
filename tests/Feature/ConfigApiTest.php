<?php

use App\Models\Installation\Config;
use App\Models\Place;
use App\Models\TypePlace;

use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

test('can retrieve default configuration', function () {
    Config::create([
        'content' => config('default-theme'),
        'place_id' => null,
    ]);

    $response = getJson('/api/config/default');

    $response->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'primary_color',
                'secondary_color',
                'font_family',
            ],
        ]);
});

test('can retrieve configuration for a specific place', function () {
    $place = Place::factory()->create();

    $response = getJson("/api/config/{$place->id}");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'primary_color',
                'secondary_color',
                'font_family',
            ],
        ]);
});

test('returns configuration from observer when place is created', function () {
    $place = Place::factory()->create();

    $response = getJson("/api/config/{$place->id}");

    $response->assertSuccessful()
        ->assertJsonStructure([
            'data' => [
                'primary_color',
                'secondary_color',
                'font_family',
            ],
        ]);
});

test('can update configuration for a place', function () {
    $place = Place::factory()->create();

    $config = Config::query()->where('place_id', $place->id)->first();

    $newData = [
        'primary_color' => '#FF0000',
        'organization_name' => 'Updated Organization',
    ];

    $response = putJson("/api/config/{$place->id}", $newData);

    $response->assertSuccessful()
        ->assertJsonFragment([
            'message' => 'Configuration updated successfully',
        ]);

    $config->refresh();

    expect($config->content['primary_color'])->toBe('#FF0000')
        ->and($config->content['organization_name'])->toBe('Updated Organization');
});

test('observer creates config with merged data when updating', function () {
    $place = Place::factory()->create();

    $newData = [
        'primary_color' => '#00FF00',
        'organization_name' => 'New Organization',
    ];

    $response = putJson("/api/config/{$place->id}", $newData);

    $response->assertSuccessful();

    $config = Config::query()->where('place_id', $place->id)->first();

    expect($config)->not->toBeNull()
        ->and($config->content['primary_color'])->toBe('#00FF00')
        ->and($config->content['organization_name'])->toBe('New Organization')
        ->and($config->content['font_family'])->toBe('Arial, sans-serif');
});

test('place observer creates config on place creation', function () {
    $typePlace = TypePlace::factory()->create();

    $place = Place::create([
        'name' => 'Test Place',
        'type_place_id' => $typePlace->id,
        'is_active' => true,
    ]);

    $config = Config::query()->where('place_id', $place->id)->first();

    expect($config)->not->toBeNull()
        ->and($config->content)->toBeArray()
        ->and($config->content['primary_color'])->toBe('#1E3A8A')
        ->and($config->content['secondary_color'])->toBe('#3B82F6')
        ->and($config->content['font_family'])->toBe('Arial, sans-serif');
});

test('can create configuration for a place using store method', function () {
    $place = Place::factory()->create();

    // Delete auto-created config from observer
    Config::query()->where('place_id', $place->id)->delete();

    $newData = [
        'primary_color' => '#00FF00',
        'organization_name' => 'New Organization',
    ];

    $response = postJson("/api/config/{$place->id}", $newData);

    $response->assertCreated()
        ->assertJsonFragment([
            'message' => 'Configuration created successfully',
        ]);

    $config = Config::query()->where('place_id', $place->id)->first();

    expect($config)->not->toBeNull()
        ->and($config->content['primary_color'])->toBe('#00FF00')
        ->and($config->content['organization_name'])->toBe('New Organization')
        ->and($config->content['font_family'])->toBe('Arial, sans-serif');
});

test('store method returns 409 if configuration already exists', function () {
    $place = Place::factory()->create();

    $newData = [
        'primary_color' => '#00FF00',
    ];

    $response = postJson("/api/config/{$place->id}", $newData);

    $response->assertStatus(409)
        ->assertJsonFragment([
            'message' => 'Configuration already exists for this place. Use update instead.',
        ]);
});

test('can delete configuration for a place', function () {
    $place = Place::factory()->create();

    $config = Config::query()->where('place_id', $place->id)->first();
    expect($config)->not->toBeNull();

    $response = deleteJson("/api/config/{$place->id}");

    $response->assertSuccessful()
        ->assertJsonFragment([
            'message' => 'Configuration deleted successfully',
        ]);

    $deletedConfig = Config::query()->where('place_id', $place->id)->first();
    expect($deletedConfig)->toBeNull();
});

test('delete returns 404 if configuration does not exist', function () {
    $place = Place::factory()->create();

    Config::query()->where('place_id', $place->id)->delete();

    $response = deleteJson("/api/config/{$place->id}");

    $response->assertNotFound()
        ->assertJsonFragment([
            'message' => 'Configuration not found for this place',
        ]);
});
