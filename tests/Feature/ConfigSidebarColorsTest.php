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

it('persists sidebar colors when creating a config', function () {
    $configData = [
        'place_id' => $this->place->id,
        'sidebar_header_bg' => 'oklch(0.72 0.11 178)',
        'sidebar_menu_bg' => 'oklch(0.85 0.05 200)',
        'sidebar_footer_bg' => 'oklch(0.65 0.08 150)',
    ];

    $response = $this->actingAs($this->user)
        ->post(route('configs.store'), $configData);

    $response->assertRedirect(route('configs.index'));

    $config = Config::latest()->first();

    expect($config->content['sidebar_header_bg'])->toBe('oklch(0.72 0.11 178)')
        ->and($config->content['sidebar_menu_bg'])->toBe('oklch(0.85 0.05 200)')
        ->and($config->content['sidebar_footer_bg'])->toBe('oklch(0.65 0.08 150)');
});

it('updates sidebar colors when updating a config', function () {
    $config = Config::create([
        'content' => [
            'organization_name' => 'Test Org',
            'sidebar_header_bg' => 'oklch(0.50 0.10 100)',
            'sidebar_menu_bg' => 'oklch(0.60 0.10 100)',
            'sidebar_footer_bg' => 'oklch(0.70 0.10 100)',
        ],
        'place_id' => $this->place->id,
    ]);

    $updatedData = [
        'sidebar_header_bg' => 'oklch(0.72 0.11 178)',
        'sidebar_menu_bg' => 'oklch(0.85 0.05 200)',
        'sidebar_footer_bg' => 'oklch(0.65 0.08 150)',
    ];

    $response = $this->actingAs($this->user)
        ->put(route('configs.update', $config), $updatedData);

    $response->assertRedirect(route('configs.index'));

    $config->refresh();

    expect($config->content['sidebar_header_bg'])->toBe('oklch(0.72 0.11 178)')
        ->and($config->content['sidebar_menu_bg'])->toBe('oklch(0.85 0.05 200)')
        ->and($config->content['sidebar_footer_bg'])->toBe('oklch(0.65 0.08 150)');
});

it('shares sidebar colors via themeConfig prop', function () {
    $config = Config::create([
        'content' => [
            'sidebar_header_bg' => 'oklch(0.72 0.11 178)',
            'sidebar_menu_bg' => 'oklch(0.85 0.05 200)',
            'sidebar_footer_bg' => 'oklch(0.65 0.08 150)',
        ],
        'place_id' => $this->place->id,
        'is_active' => true,
    ]);

    $response = $this->actingAs($this->user)
        ->get(route('dashboard'));

    $response->assertSuccessful();

    $props = $response->viewData('page')['props'];

    expect($props['themeConfig']['sidebar_header_bg'])->toBe('oklch(0.72 0.11 178)')
        ->and($props['themeConfig']['sidebar_menu_bg'])->toBe('oklch(0.85 0.05 200)')
        ->and($props['themeConfig']['sidebar_footer_bg'])->toBe('oklch(0.65 0.08 150)');
});
