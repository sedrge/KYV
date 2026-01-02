<?php

use App\Http\Controllers\AuditController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\MrzController;
use App\Http\Controllers\PassportOCRController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\PlaceVisitorFormController;
use App\Http\Controllers\QrCodeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TypePlaceController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VisitorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/place/{place}/visitor-form', [PlaceVisitorFormController::class, 'show'])->name('place.visitor.form');
Route::post('/place/{place}/visitor-form', [PlaceVisitorFormController::class, 'store'])->name('place.visitor.form.store');

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
    Route::resource('qr-codes', QrCodeController::class);

    Route::prefix('qr-codes')->name('qr-codes.')->group(function () {
        Route::get('/{qr_code}/download', [QrCodeController::class, 'download'])->name('download');
        Route::get('/{qr_code}/generate', [QrCodeController::class, 'generate'])->name('generate');
        Route::get('/{qr_code}/print', [QrCodeController::class, 'print'])->name('print');
    });

    Route::prefix('audits')->name('audits.')->group(function () {
        Route::get('/', [AuditController::class, 'index'])->name('index');
        Route::get('/statistics', [AuditController::class, 'statistics'])->name('statistics');
        Route::get('/export', [AuditController::class, 'export'])->name('export');
        Route::get('/user/{userId}', [AuditController::class, 'userAudits'])->name('user');
        Route::get('/{id}', [AuditController::class, 'show'])->name('show');
    });
});

/*
Route::middleware(['auth'])->group(function () {
    Route::get('/mrz', [MrzController::class, 'index'])->name('mrz.index');
    Route::post('/mrz/parse', [MrzController::class, 'parse'])->name('mrz.parse');
    // routes/web.php
    Route::post('/ocr/process', [PassportOCRController::class, 'process'])->name('ocr.process');

});
*/
Route::get('/mrz', [MrzController::class, 'index'])->name('mrz.index');
Route::post('/mrz/parse', [MrzController::class, 'parse'])->name('mrz.parse');
// routes/web.php
Route::post('/ocr/process', [PassportOCRController::class, 'process'])->name('ocr.process');

require __DIR__.'/settings.php';
