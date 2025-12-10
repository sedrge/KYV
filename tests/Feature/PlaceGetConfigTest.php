<?php

use App\Models\Installation\Config;
use App\Models\Place;

test('getConfig returns place-specific active config first', function () {
    $place = Place::factory()->create();

    $config = Config::query()->where('place_id', $place->id)->first();
    expect($config)->not->toBeNull();

    $retrievedConfig = $place->getConfig();

    expect($retrievedConfig)->not->toBeNull()
        ->and($retrievedConfig->id)->toBe($config->id)
        ->and($retrievedConfig->place_id)->toBe($place->id);
});

test('getConfig returns default active config when place has no config', function () {
    $place = Place::factory()->create();

    // Delete the place-specific config created by observer
    Config::query()->where('place_id', $place->id)->delete();

    // Create a default active config
    $defaultConfig = Config::create([
        'content' => config('default-theme'),
        'place_id' => null,
        'is_active' => true,
    ]);

    $retrievedConfig = $place->getConfig();

    expect($retrievedConfig)->not->toBeNull()
        ->and($retrievedConfig->id)->toBe($defaultConfig->id)
        ->and($retrievedConfig->place_id)->toBeNull();
});

test('getConfig returns default inactive config when no active configs exist', function () {
    $place = Place::factory()->create();

    // Delete all active configs
    Config::query()->delete();

    // Create an inactive default config
    $inactiveDefault = Config::create([
        'content' => config('default-theme'),
        'place_id' => null,
        'is_active' => false,
    ]);

    $retrievedConfig = $place->getConfig();

    expect($retrievedConfig)->not->toBeNull()
        ->and($retrievedConfig->id)->toBe($inactiveDefault->id)
        ->and($retrievedConfig->is_active)->toBeFalse();
});

test('getConfig returns null when no configs exist at all', function () {
    $place = Place::factory()->create();

    // Delete all configs
    Config::query()->delete();

    $retrievedConfig = $place->getConfig();

    expect($retrievedConfig)->toBeNull();
});

test('user can access dashboard when place has config', function () {
    $user = \App\Models\User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
});

test('user can access dashboard when no config exists', function () {
    $user = \App\Models\User::factory()->create();

    // Delete all configs to simulate the error scenario
    Config::query()->delete();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertSuccessful();
});
