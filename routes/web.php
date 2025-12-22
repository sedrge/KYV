<?php

use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MrzController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\VisitorController;
use App\Http\Controllers\TypePlaceController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PassportOCRController;


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
    Route::resource('visitors', VisitorController::class);

    Route::prefix('audits')->name('audits.')->group(function () {
        Route::get('/', [AuditController::class, 'index'])->name('index');
        Route::get('/statistics', [AuditController::class, 'statistics'])->name('statistics');
        Route::get('/export', [AuditController::class, 'export'])->name('export');
        Route::get('/user/{userId}', [AuditController::class, 'userAudits'])->name('user');
        Route::get('/{id}', [AuditController::class, 'show'])->name('show');
    });
});


Route::middleware(['auth'])->group(function () {
    Route::get('/mrz', [MrzController::class, 'index'])->name('mrz.index');
    Route::post('/mrz/parse', [MrzController::class, 'parse'])->name('mrz.parse');
    // routes/web.php
    Route::post('/ocr/process', [PassportOCRController::class, 'process'])->name('ocr.process');

});


require __DIR__.'/settings.php';
