<?php

use App\Models\User;
use App\Models\Visitor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('visitors index page is displayed', function () {
    $response = $this->get(route('visitors.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Visitors/Index'));
});

test('visitors create page is displayed', function () {
    $response = $this->get(route('visitors.create'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Visitors/Create'));
});

test('visitor can be created with valid data', function () {
    $this->withoutMiddleware();
    Storage::fake('public');

    $data = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'date_of_birth' => '1990-01-01',
        'place_of_birth' => 'Paris',
        'document_type' => 'Passport',
        'document_number' => 'AB123456',
        'nationality' => 'French',
        'email' => 'john.doe@example.com',
        'phone_number' => '0123456789',
        'phone_country_code' => '+33',
    ];

    $response = $this->post(route('visitors.store'), $data);

    $response->assertRedirect(route('visitors.index'));
    $this->assertDatabaseHas('visitors', [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'document_number' => 'AB123456',
    ]);
});

test('visitor creation requires first name', function () {
    $this->withoutMiddleware();
    $data = [
        'last_name' => 'Doe',
        'document_type' => 'Passport',
        'document_number' => 'AB123456',
    ];

    $response = $this->post(route('visitors.store'), $data);

    $response->assertSessionHasErrors(['first_name']);
});

test('visitor creation requires last name', function () {
    $this->withoutMiddleware();
    $data = [
        'first_name' => 'John',
        'document_type' => 'Passport',
        'document_number' => 'AB123456',
    ];

    $response = $this->post(route('visitors.store'), $data);

    $response->assertSessionHasErrors(['last_name']);
});

test('visitor creation requires document type', function () {
    $this->withoutMiddleware();
    $data = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'document_number' => 'AB123456',
    ];

    $response = $this->post(route('visitors.store'), $data);

    $response->assertSessionHasErrors(['document_type']);
});

test('visitor creation requires document number', function () {
    $this->withoutMiddleware();
    $data = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'document_type' => 'Passport',
    ];

    $response = $this->post(route('visitors.store'), $data);

    $response->assertSessionHasErrors(['document_number']);
});

test('visitor can be created with document scan', function () {
    $this->withoutMiddleware();
    Storage::fake('public');

    $file = UploadedFile::fake()->create('document.jpg', 100, 'image/jpeg');

    $data = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'document_type' => 'Passport',
        'document_number' => 'AB123456',
        'document_scan' => $file,
    ];

    $response = $this->post(route('visitors.store'), $data);

    $response->assertRedirect(route('visitors.index'));

    $visitor = Visitor::where('document_number', 'AB123456')->first();
    expect($visitor->document_scan_path)->not->toBeNull();
    Storage::disk('public')->assertExists($visitor->document_scan_path);
});

test('visitor can be created with selfie', function () {
    $this->withoutMiddleware();
    Storage::fake('public');

    $file = UploadedFile::fake()->create('selfie.jpg', 100, 'image/jpeg');

    $data = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'document_type' => 'Passport',
        'document_number' => 'AB123456',
        'selfie' => $file,
    ];

    $response = $this->post(route('visitors.store'), $data);

    $response->assertRedirect(route('visitors.index'));

    $visitor = Visitor::where('document_number', 'AB123456')->first();
    expect($visitor->selfie_path)->not->toBeNull();
    Storage::disk('public')->assertExists($visitor->selfie_path);
});

test('visitor can be created with signature', function () {
    $this->withoutMiddleware();
    Storage::fake('public');

    $file = UploadedFile::fake()->create('signature.png', 100, 'image/png');

    $data = [
        'first_name' => 'John',
        'last_name' => 'Doe',
        'document_type' => 'Passport',
        'document_number' => 'AB123456',
        'signature' => $file,
    ];

    $response = $this->post(route('visitors.store'), $data);

    $response->assertRedirect(route('visitors.index'));

    $visitor = Visitor::where('document_number', 'AB123456')->first();
    expect($visitor->signature_path)->not->toBeNull();
    Storage::disk('public')->assertExists($visitor->signature_path);
});

test('visitor show page displays visitor details', function () {
    $visitor = Visitor::factory()->create();

    $response = $this->get(route('visitors.show', $visitor));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Visitors/Show')
        ->has('visitor')
    );
});

test('visitor can be updated', function () {
    $visitor = Visitor::factory()->create();

    $data = [
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'document_type' => 'ID Card',
        'document_number' => 'CD789012',
    ];

    $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class)
        ->put(route('visitors.update', $visitor), $data);

    $response->assertRedirect(route('visitors.index'));
    $this->assertDatabaseHas('visitors', [
        'id' => $visitor->id,
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'document_number' => 'CD789012',
    ]);
});

test('visitor can be deleted', function () {
    $visitor = Visitor::factory()->create();

    $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class)
        ->delete(route('visitors.destroy', $visitor));

    $response->assertRedirect(route('visitors.index'));
    $this->assertDatabaseMissing('visitors', ['id' => $visitor->id]);
});

test('visitor deletion removes associated files', function () {
    Storage::fake('public');

    $documentFile = UploadedFile::fake()->create('document.jpg', 100, 'image/jpeg');
    $selfieFile = UploadedFile::fake()->create('selfie.jpg', 100, 'image/jpeg');
    $signatureFile = UploadedFile::fake()->create('signature.png', 100, 'image/png');

    $visitor = Visitor::factory()->create([
        'document_scan_path' => $documentFile->store('visitors/documents', 'public'),
        'selfie_path' => $selfieFile->store('visitors/selfies', 'public'),
        'signature_path' => $signatureFile->store('visitors/signatures', 'public'),
    ]);

    Storage::disk('public')->assertExists($visitor->document_scan_path);
    Storage::disk('public')->assertExists($visitor->selfie_path);
    Storage::disk('public')->assertExists($visitor->signature_path);

    $response = $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class)
        ->delete(route('visitors.destroy', $visitor));

    $response->assertRedirect(route('visitors.index'));
    Storage::disk('public')->assertMissing($visitor->document_scan_path);
    Storage::disk('public')->assertMissing($visitor->selfie_path);
    Storage::disk('public')->assertMissing($visitor->signature_path);
});
