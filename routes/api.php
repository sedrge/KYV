<?php

use App\Http\Controllers\Api\ConfigController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('config')->group(function () {
    Route::get('/', [ConfigController::class, 'index']);
    Route::get('/default', [ConfigController::class, 'default']);
    Route::get('/{placeId}', [ConfigController::class, 'show']);
    Route::post('/{placeId}', [ConfigController::class, 'store']);
    Route::put('/{placeId}', [ConfigController::class, 'update']);
    Route::delete('/{placeId}', [ConfigController::class, 'destroy']);
});
