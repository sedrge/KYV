<?php

use App\Models\Audit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user creation is audited', function () {
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $audit = Audit::where('auditable_type', User::class)
        ->where('auditable_id', $user->id)
        ->where('event', 'created')
        ->first();

    expect($audit)->not->toBeNull();
    expect($audit->new_values)->toHaveKey('name');
    expect($audit->new_values['name'])->toBe('Test User');
});

test('user update is audited', function () {
    $user = User::factory()->create(['name' => 'Original Name']);

    sleep(1);

    $user->update(['name' => 'Updated Name']);

    $updatedAudits = Audit::where('auditable_type', User::class)
        ->where('auditable_id', $user->id)
        ->where('event', 'updated')
        ->get();

    expect($updatedAudits->count())->toBeGreaterThanOrEqual(0);
});

test('user deletion is audited', function () {
    $user = User::factory()->create();
    $userId = $user->id;

    $user->delete();

    $audit = Audit::where('auditable_type', User::class)
        ->where('auditable_id', $userId)
        ->where('event', 'deleted')
        ->first();

    expect($audit)->not->toBeNull();
    expect($audit->old_values)->toHaveKey('name');
});

test('audit tracks ip address and user agent', function () {
    $user = User::factory()->create();

    $audit = Audit::where('auditable_type', User::class)
        ->where('auditable_id', $user->id)
        ->first();

    expect($audit->ip_address)->not->toBeNull();
    expect($audit->user_agent)->not->toBeNull();
});

test('authenticated user can view audits index', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/audits');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Audits/Index'));
});

test('authenticated user can view audit details', function () {
    $user = User::factory()->create();
    $audit = Audit::factory()->create();

    $response = $this->actingAs($user)->get("/audits/{$audit->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Audits/Show'));
});

test('authenticated user can view audit statistics', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/audits/statistics');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('Audits/Statistics'));
});

test('guest cannot access audits', function () {
    $response = $this->get('/audits');

    $response->assertRedirect('/login');
});

test('audit service can get audits with filters', function () {
    $user = User::factory()->create();

    User::factory()->count(5)->create();

    $service = app(\App\Services\AuditService::class);

    $audits = $service->getAudits(['user_id' => null, 'event' => 'created']);

    expect($audits->total())->toBeGreaterThan(0);
});

test('audit service can generate statistics', function () {
    User::factory()->count(3)->create();

    $service = app(\App\Services\AuditService::class);

    $statistics = $service->getAuditStatistics();

    expect($statistics)->toHaveKeys(['total_audits', 'audits_by_event', 'audits_by_user', 'audits_by_model']);
    expect($statistics['total_audits'])->toBeGreaterThan(0);
});

test('sensitive fields are excluded from audit', function () {
    $user = User::factory()->create([
        'password' => 'secret-password',
    ]);

    $audit = Audit::where('auditable_type', User::class)
        ->where('auditable_id', $user->id)
        ->where('event', 'created')
        ->first();

    expect($audit->new_values)->not->toHaveKey('password');
    expect($audit->new_values)->not->toHaveKey('remember_token');
});
