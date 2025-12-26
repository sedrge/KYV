<?php

use App\Models\QrCode;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::create(['name' => 'Super Admin']);
    Role::create(['name' => 'Admin']);

    $this->superAdmin = User::factory()->create();
    $this->superAdmin->assignRole('Super Admin');

    $this->admin = User::factory()->create();
    $this->admin->assignRole('Admin');

    $this->regularUser = User::factory()->create();
});

test('super admin can view qr codes index', function () {
    $this->actingAs($this->superAdmin);

    $response = $this->get(route('qr-codes.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('QrCodes/Index'));
});

test('admin can view qr codes index', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('qr-codes.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('QrCodes/Index'));
});

test('regular user cannot view qr codes index', function () {
    $this->actingAs($this->regularUser);

    $response = $this->get(route('qr-codes.index'));

    $response->assertForbidden();
});

test('super admin can view create qr code page', function () {
    $this->actingAs($this->superAdmin);

    $response = $this->get(route('qr-codes.create'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('QrCodes/Create'));
});

test('admin can view create qr code page', function () {
    $this->actingAs($this->admin);

    $response = $this->get(route('qr-codes.create'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('QrCodes/Create'));
});

test('regular user cannot view create qr code page', function () {
    $this->actingAs($this->regularUser);

    $response = $this->get(route('qr-codes.create'));

    $response->assertForbidden();
});

test('super admin can create qr code with valid data', function () {
    $this->actingAs($this->superAdmin);

    $data = [
        'title' => 'Test QR Code',
        'url' => 'https://example.com',
        'size' => 300,
    ];

    $response = $this->post(route('qr-codes.store'), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('qr_codes', [
        'title' => 'Test QR Code',
        'url' => 'https://example.com',
        'size' => '300',
        'user_id' => $this->superAdmin->id,
    ]);
});

test('admin can create qr code with valid data', function () {
    $this->actingAs($this->admin);

    $data = [
        'title' => 'Admin QR Code',
        'url' => 'https://admin.example.com',
        'size' => 400,
    ];

    $response = $this->post(route('qr-codes.store'), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('qr_codes', [
        'title' => 'Admin QR Code',
        'url' => 'https://admin.example.com',
        'user_id' => $this->admin->id,
    ]);
});

test('regular user cannot create qr code', function () {
    $this->actingAs($this->regularUser);

    $data = [
        'title' => 'Test QR Code',
        'url' => 'https://example.com',
    ];

    $response = $this->post(route('qr-codes.store'), $data);

    $response->assertForbidden();
});

test('qr code creation requires title', function () {
    $this->actingAs($this->superAdmin);

    $data = [
        'url' => 'https://example.com',
    ];

    $response = $this->post(route('qr-codes.store'), $data);

    $response->assertSessionHasErrors(['title']);
});

test('qr code creation requires url', function () {
    $this->actingAs($this->superAdmin);

    $data = [
        'title' => 'Test QR Code',
    ];

    $response = $this->post(route('qr-codes.store'), $data);

    $response->assertSessionHasErrors(['url']);
});

test('qr code creation requires valid url', function () {
    $this->actingAs($this->superAdmin);

    $data = [
        'title' => 'Test QR Code',
        'url' => 'not-a-valid-url',
    ];

    $response = $this->post(route('qr-codes.store'), $data);

    $response->assertSessionHasErrors(['url']);
});

test('qr code size must be between 100 and 1000', function () {
    $this->actingAs($this->superAdmin);

    $data = [
        'title' => 'Test QR Code',
        'url' => 'https://example.com',
        'size' => 50,
    ];

    $response = $this->post(route('qr-codes.store'), $data);
    $response->assertSessionHasErrors(['size']);

    $data['size'] = 1500;
    $response = $this->post(route('qr-codes.store'), $data);
    $response->assertSessionHasErrors(['size']);
});

test('qr code show page displays qr code details', function () {
    $this->actingAs($this->superAdmin);

    $qrCode = QrCode::factory()->create(['user_id' => $this->superAdmin->id]);

    $response = $this->get(route('qr-codes.show', $qrCode));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('QrCodes/Show')
        ->has('qrCode')
    );
});

test('super admin can update qr code', function () {
    $this->actingAs($this->superAdmin);

    $qrCode = QrCode::factory()->create(['user_id' => $this->superAdmin->id]);

    $data = [
        'title' => 'Updated QR Code',
        'url' => 'https://updated.example.com',
        'size' => 500,
    ];

    $response = $this->put(route('qr-codes.update', $qrCode), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('qr_codes', [
        'id' => $qrCode->id,
        'title' => 'Updated QR Code',
        'url' => 'https://updated.example.com',
        'size' => '500',
    ]);
});

test('admin can update qr code', function () {
    $this->actingAs($this->admin);

    $qrCode = QrCode::factory()->create(['user_id' => $this->admin->id]);

    $data = [
        'title' => 'Updated by Admin',
        'url' => 'https://admin-updated.example.com',
        'size' => 350,
    ];

    $response = $this->put(route('qr-codes.update', $qrCode), $data);

    $response->assertRedirect();
    $this->assertDatabaseHas('qr_codes', [
        'id' => $qrCode->id,
        'title' => 'Updated by Admin',
    ]);
});

test('regular user cannot update qr code', function () {
    $this->actingAs($this->regularUser);

    $qrCode = QrCode::factory()->create(['user_id' => $this->superAdmin->id]);

    $data = [
        'title' => 'Unauthorized Update',
        'url' => 'https://unauthorized.example.com',
    ];

    $response = $this->put(route('qr-codes.update', $qrCode), $data);

    $response->assertForbidden();
});

test('super admin can delete qr code', function () {
    $this->actingAs($this->superAdmin);

    $qrCode = QrCode::factory()->create(['user_id' => $this->superAdmin->id]);

    $response = $this->delete(route('qr-codes.destroy', $qrCode));

    $response->assertRedirect(route('qr-codes.index'));
    $this->assertDatabaseMissing('qr_codes', ['id' => $qrCode->id]);
});

test('admin can delete qr code', function () {
    $this->actingAs($this->admin);

    $qrCode = QrCode::factory()->create(['user_id' => $this->admin->id]);

    $response = $this->delete(route('qr-codes.destroy', $qrCode));

    $response->assertRedirect(route('qr-codes.index'));
    $this->assertDatabaseMissing('qr_codes', ['id' => $qrCode->id]);
});

test('regular user cannot delete qr code', function () {
    $this->actingAs($this->regularUser);

    $qrCode = QrCode::factory()->create(['user_id' => $this->superAdmin->id]);

    $response = $this->delete(route('qr-codes.destroy', $qrCode));

    $response->assertForbidden();
});

test('qr code download increments download count', function () {
    $this->actingAs($this->superAdmin);

    $qrCode = QrCode::factory()->create([
        'user_id' => $this->superAdmin->id,
        'download_count' => 0,
    ]);

    $response = $this->get(route('qr-codes.download', $qrCode));

    $response->assertSuccessful();
    $response->assertHeader('Content-Type', 'image/png');

    $qrCode->refresh();
    expect($qrCode->download_count)->toBe(1);
});

test('qr code generate returns png image', function () {
    $this->actingAs($this->superAdmin);

    $qrCode = QrCode::factory()->create(['user_id' => $this->superAdmin->id]);

    $response = $this->get(route('qr-codes.generate', $qrCode));

    $response->assertSuccessful();
    $response->assertHeader('Content-Type', 'image/png');
});

test('qr code print page displays correctly', function () {
    $this->actingAs($this->superAdmin);

    $qrCode = QrCode::factory()->create([
        'user_id' => $this->superAdmin->id,
        'print_count' => 0,
    ]);

    $response = $this->get(route('qr-codes.print', $qrCode));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('QrCodes/Print')
        ->has('qrCode')
    );

    $qrCode->refresh();
    expect($qrCode->print_count)->toBe(1);
});

test('regular user cannot download qr code', function () {
    $this->actingAs($this->regularUser);

    $qrCode = QrCode::factory()->create(['user_id' => $this->superAdmin->id]);

    $response = $this->get(route('qr-codes.download', $qrCode));

    $response->assertForbidden();
});

test('regular user cannot generate qr code', function () {
    $this->actingAs($this->regularUser);

    $qrCode = QrCode::factory()->create(['user_id' => $this->superAdmin->id]);

    $response = $this->get(route('qr-codes.generate', $qrCode));

    $response->assertForbidden();
});

test('regular user cannot print qr code', function () {
    $this->actingAs($this->regularUser);

    $qrCode = QrCode::factory()->create(['user_id' => $this->superAdmin->id]);

    $response = $this->get(route('qr-codes.print', $qrCode));

    $response->assertForbidden();
});
