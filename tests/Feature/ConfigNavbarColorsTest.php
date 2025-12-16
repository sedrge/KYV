<?php

use App\Models\Installation\Config;
use App\Models\Place;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->place = Place::factory()->create();
    $this->user->place_id = $this->place->id;
    $this->user->save();
});

it('persists navbar colors when creating a config', function () {
    $configData = [
        'place_id' => $this->place->id,
        'navbar_bg' => 'oklch(0.72 0.11 178)',
        'navbar_text' => 'oklch(0.95 0.02 200)',
        'navbar_border' => 'oklch(0.65 0.08 150)',
    ];

    $response = $this->actingAs($this->user)
        ->post(route('configs.store'), $configData);

    $response->assertRedirect(route('configs.index'));

    $config = Config::latest()->first();

    expect($config->content['navbar_bg'])->toBe('oklch(0.72 0.11 178)')
        ->and($config->content['navbar_text'])->toBe('oklch(0.95 0.02 200)')
        ->and($config->content['navbar_border'])->toBe('oklch(0.65 0.08 150)');
});

it('updates navbar colors when updating a config', function () {
    $config = Config::create([
        'content' => [
            'organization_name' => 'Test Org',
            'navbar_bg' => 'oklch(0.50 0.10 100)',
            'navbar_text' => 'oklch(0.90 0.05 100)',
            'navbar_border' => 'oklch(0.70 0.10 100)',
        ],
        'place_id' => $this->place->id,
    ]);

    $updatedData = [
        'navbar_bg' => 'oklch(0.72 0.11 178)',
        'navbar_text' => 'oklch(0.95 0.02 200)',
        'navbar_border' => 'oklch(0.65 0.08 150)',
    ];

    $response = $this->actingAs($this->user)
        ->put(route('configs.update', $config), $updatedData);

    $response->assertRedirect(route('configs.index'));

    $config->refresh();

    expect($config->content['navbar_bg'])->toBe('oklch(0.72 0.11 178)')
        ->and($config->content['navbar_text'])->toBe('oklch(0.95 0.02 200)')
        ->and($config->content['navbar_border'])->toBe('oklch(0.65 0.08 150)');
});

it('shares navbar colors via themeConfig prop', function () {
    $config = Config::create([
        'content' => [
            'navbar_bg' => 'oklch(0.72 0.11 178)',
            'navbar_text' => 'oklch(0.95 0.02 200)',
            'navbar_border' => 'oklch(0.65 0.08 150)',
        ],
        'place_id' => $this->place->id,
        'is_active' => true,
    ]);

    $response = $this->actingAs($this->user)
        ->get(route('dashboard'));

    $response->assertSuccessful();

    $props = $response->viewData('page')['props'];

    expect($props['themeConfig']['navbar_bg'])->toBe('oklch(0.72 0.11 178)')
        ->and($props['themeConfig']['navbar_text'])->toBe('oklch(0.95 0.02 200)')
        ->and($props['themeConfig']['navbar_border'])->toBe('oklch(0.65 0.08 150)');
});
