<?php

use App\Models\Installation\Config;
use App\Models\Place;
use App\Models\User;

test('config stores colors in OKLCH format', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();

    $this->actingAs($user);

    $response = $this->post(route('configs.store'), [
        'place_id' => $place->id,
        'organization_name' => 'Test Organization',
        'sidebar_header_bg' => 'oklch(0.5 0.1 180)',
        'sidebar_menu_bg' => 'oklch(0.6 0.15 200)',
        'sidebar_footer_bg' => 'oklch(0.7 0.2 220)',
        'primary_color' => 'oklch(0.55 0.22 29.23)',
        'secondary_color' => 'oklch(0.65 0.18 250.5)',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $config = Config::latest()->first();

    expect($config->content['sidebar_header_bg'])->toBe('oklch(0.5 0.1 180)');
    expect($config->content['sidebar_menu_bg'])->toBe('oklch(0.6 0.15 200)');
    expect($config->content['sidebar_footer_bg'])->toBe('oklch(0.7 0.2 220)');
    expect($config->content['primary_color'])->toBe('oklch(0.55 0.22 29.23)');
    expect($config->content['secondary_color'])->toBe('oklch(0.65 0.18 250.5)');
});

test('config updates colors in OKLCH format', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();
    $config = Config::factory()->create([
        'place_id' => $place->id,
        'content' => [
            'organization_name' => 'Old Organization',
            'sidebar_header_bg' => 'oklch(0.3 0.05 100)',
        ],
    ]);

    $this->actingAs($user);

    $response = $this->put(route('configs.update', $config), [
        'place_id' => $place->id,
        'organization_name' => 'Updated Organization',
        'sidebar_header_bg' => 'oklch(0.8 0.25 300)',
        'sidebar_menu_bg' => 'oklch(0.75 0.2 280)',
        'primary_color' => 'oklch(0.6 0.3 150.5)',
    ]);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect();

    $config->refresh();

    expect($config->content['sidebar_header_bg'])->toBe('oklch(0.8 0.25 300)');
    expect($config->content['sidebar_menu_bg'])->toBe('oklch(0.75 0.2 280)');
    expect($config->content['primary_color'])->toBe('oklch(0.6 0.3 150.5)');
});

test('config accepts OKLCH format with proper length validation', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();

    $this->actingAs($user);

    $longOklchValue = 'oklch(0.123456 0.123456 123.456)';

    $response = $this->post(route('configs.store'), [
        'place_id' => $place->id,
        'organization_name' => 'Test Organization',
        'primary_color' => $longOklchValue,
    ]);

    $response->assertSessionHasNoErrors();

    $config = Config::latest()->first();
    expect($config->content['primary_color'])->toBe($longOklchValue);
});

test('config rejects OKLCH values exceeding max length', function () {
    $user = User::factory()->create();
    $place = Place::factory()->create();

    $this->actingAs($user);

    $tooLongValue = str_repeat('oklch(0.123456 0.123456 123.456)', 3);

    $response = $this->post(route('configs.store'), [
        'place_id' => $place->id,
        'organization_name' => 'Test Organization',
        'primary_color' => $tooLongValue,
    ]);

    $response->assertSessionHasErrors(['primary_color']);
});
