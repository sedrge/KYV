<?php

use App\Http\Controllers\AuditController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TypePlaceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('type-places', TypePlaceController::class);
    Route::resource('places', PlaceController::class);
    Route::resource('configs', ConfigController::class);
    Route::resource('users', UserController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);

    Route::prefix('audits')->name('audits.')->group(function () {
        Route::get('/', [AuditController::class, 'index'])->name('index');
        Route::get('/statistics', [AuditController::class, 'statistics'])->name('statistics');
        Route::get('/export', [AuditController::class, 'export'])->name('export');
        Route::get('/user/{userId}', [AuditController::class, 'userAudits'])->name('user');
        Route::get('/{id}', [AuditController::class, 'show'])->name('show');
    });
});

require __DIR__.'/settings.php';
