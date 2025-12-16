<?php

use App\Models\Installation\Config;
use App\Models\Place;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->place = Place::factory()->create(['is_active' => true]);
});

it('persists sidebar fields when creating a config', function () {
    // Test direct model creation (simulating what the controller does)
    $configData = [
        'place_id' => $this->place->id,
        'organization_name' => 'Test Organization',
        'sidebar_header_bg' => '#FF5733',
        'sidebar_header_text' => '#FFFFFF',
        'sidebar_header_font_family' => 'sans-serif',
        'sidebar_header_font_size' => 'medium',
        'sidebar_menu_bg' => '#2C3E50',
        'sidebar_menu_text' => '#ECF0F1',
        'sidebar_menu_font_family' => 'serif',
        'sidebar_menu_font_size' => 'large',
        'sidebar_footer_bg' => '#34495E',
        'sidebar_footer_text' => '#BDC3C7',
        'sidebar_footer_font_family' => 'monospace',
        'sidebar_footer_font_size' => 'small',
    ];

    $config = Config::create([
        'content' => $configData,
        'place_id' => $configData['place_id'] ?? null,
    ]);

    expect($config)->not->toBeNull()
        ->and($config->content['sidebar_header_bg'])->toBe('#FF5733')
        ->and($config->content['sidebar_header_text'])->toBe('#FFFFFF')
        ->and($config->content['sidebar_header_font_family'])->toBe('sans-serif')
        ->and($config->content['sidebar_header_font_size'])->toBe('medium')
        ->and($config->content['sidebar_menu_bg'])->toBe('#2C3E50')
        ->and($config->content['sidebar_menu_text'])->toBe('#ECF0F1')
        ->and($config->content['sidebar_menu_font_family'])->toBe('serif')
        ->and($config->content['sidebar_menu_font_size'])->toBe('large')
        ->and($config->content['sidebar_footer_bg'])->toBe('#34495E')
        ->and($config->content['sidebar_footer_text'])->toBe('#BDC3C7')
        ->and($config->content['sidebar_footer_font_family'])->toBe('monospace')
        ->and($config->content['sidebar_footer_font_size'])->toBe('small');
});

it('merges existing content when updating a config', function () {
    // Create initial config with some fields
    $config = Config::create([
        'place_id' => $this->place->id,
        'content' => [
            'organization_name' => 'Initial Organization',
            'primary_color' => '#3498DB',
            'sidebar_header_bg' => '#FF5733',
            'sidebar_menu_bg' => '#2C3E50',
        ],
    ]);

    // Update only some fields
    $updateData = [
        'organization_name' => 'Updated Organization',
        'sidebar_header_bg' => '#27AE60',
    ];

    $response = $this->actingAs($this->user)->put(route('configs.update', $config), $updateData);

    $response->assertRedirect(route('configs.index'));
    $response->assertSessionHas('success');

    $config->refresh();

    // Check that updated fields are changed
    expect($config->content['organization_name'])->toBe('Updated Organization')
        ->and($config->content['sidebar_header_bg'])->toBe('#27AE60')
        // Check that non-updated fields are preserved
        ->and($config->content['primary_color'])->toBe('#3498DB')
        ->and($config->content['sidebar_menu_bg'])->toBe('#2C3E50');
});

it('preserves all fields when updating only one field', function () {
    // Create config with multiple sidebar fields
    $config = Config::create([
        'place_id' => $this->place->id,
        'content' => [
            'organization_name' => 'Test Org',
            'sidebar_header_bg' => '#FF5733',
            'sidebar_header_text' => '#FFFFFF',
            'sidebar_header_font_family' => 'sans-serif',
            'sidebar_header_font_size' => 'medium',
            'sidebar_menu_bg' => '#2C3E50',
            'sidebar_menu_text' => '#ECF0F1',
            'sidebar_menu_font_family' => 'serif',
            'sidebar_menu_font_size' => 'large',
            'sidebar_footer_bg' => '#34495E',
            'sidebar_footer_text' => '#BDC3C7',
            'sidebar_footer_font_family' => 'monospace',
            'sidebar_footer_font_size' => 'small',
            'primary_color' => '#3498DB',
            'secondary_color' => '#E74C3C',
        ],
    ]);

    // Update only organization name
    $updateData = [
        'organization_name' => 'Updated Organization Name',
    ];

    $response = $this->actingAs($this->user)->put(route('configs.update', $config), $updateData);

    $response->assertRedirect(route('configs.index'));

    $config->refresh();

    // Verify the updated field
    expect($config->content['organization_name'])->toBe('Updated Organization Name');

    // Verify ALL sidebar fields are still present
    expect($config->content['sidebar_header_bg'])->toBe('#FF5733')
        ->and($config->content['sidebar_header_text'])->toBe('#FFFFFF')
        ->and($config->content['sidebar_header_font_family'])->toBe('sans-serif')
        ->and($config->content['sidebar_header_font_size'])->toBe('medium')
        ->and($config->content['sidebar_menu_bg'])->toBe('#2C3E50')
        ->and($config->content['sidebar_menu_text'])->toBe('#ECF0F1')
        ->and($config->content['sidebar_menu_font_family'])->toBe('serif')
        ->and($config->content['sidebar_menu_font_size'])->toBe('large')
        ->and($config->content['sidebar_footer_bg'])->toBe('#34495E')
        ->and($config->content['sidebar_footer_text'])->toBe('#BDC3C7')
        ->and($config->content['sidebar_footer_font_family'])->toBe('monospace')
        ->and($config->content['sidebar_footer_font_size'])->toBe('small')
        ->and($config->content['primary_color'])->toBe('#3498DB')
        ->and($config->content['secondary_color'])->toBe('#E74C3C');
});
