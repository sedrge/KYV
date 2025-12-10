<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConfigRequest;
use App\Http\Requests\UpdateConfigRequest;
use App\Models\Installation\Config;
use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ConfigController extends Controller
{
    /**
     * Get configuration for the current place or default config.
     */
    public function index(Request $request): JsonResponse
    {
        $placeId = $request->query('place_id');
        Log::info('Fetching config for place_id: '.$placeId);

        if ($placeId) {
            $config = Config::query()
                ->where('place_id', $placeId)
                ->first();
        } else {
            $config = Config::query()
                ->whereNull('place_id')
                ->first();
        }

        if (! $config) {
            return response()->json([
                'message' => 'Configuration not found',
                'data' => config('default-theme'),
            ], 404);
        }

        return response()->json([
            'data' => $config->content,
        ]);
    }

    /**
     * Get configuration for a specific place.
     */
    public function show(string $placeId): JsonResponse
    {
        $config = Config::query()
            ->where('place_id', $placeId)
            ->first();

        if (! $config) {
            return response()->json([
                'message' => 'Configuration not found for this place',
                'data' => config('default-theme'),
            ], 404);
        }

        return response()->json([
            'data' => $config->content,
        ]);
    }

    /**
     * Create a new configuration for a specific place.
     */
    public function store(StoreConfigRequest $request, string $placeId): JsonResponse
    {
        $place = Place::findOrFail($placeId);

        $config = Config::query()
            ->where('place_id', $placeId)
            ->first();

        if ($config) {
            return response()->json([
                'message' => 'Configuration already exists for this place. Use update instead.',
            ], 409);
        }

        $validated = $request->validated();

        $config = Config::create([
            'content' => array_merge(config('default-theme'), $validated),
            'place_id' => $placeId,
        ]);

        return response()->json([
            'message' => 'Configuration created successfully',
            'data' => $config->content,
        ], 201);
    }

    /**
     * Update configuration for a specific place.
     */
    public function update(UpdateConfigRequest $request, string $placeId): JsonResponse
    {
        $place = Place::findOrFail($placeId);

        $config = Config::query()
            ->where('place_id', $placeId)
            ->first();

        $validated = $request->validated();

        if ($config) {
            $config->update([
                'content' => array_merge($config->content, $validated),
            ]);
        } else {
            $config = Config::create([
                'content' => array_merge(config('default-theme'), $validated),
                'place_id' => $placeId,
            ]);
        }

        return response()->json([
            'message' => 'Configuration updated successfully',
            'data' => $config->content,
        ]);
    }

    /**
     * Delete configuration for a specific place.
     */
    public function destroy(string $placeId): JsonResponse
    {
        $place = Place::findOrFail($placeId);

        $config = Config::query()
            ->where('place_id', $placeId)
            ->first();

        if (! $config) {
            return response()->json([
                'message' => 'Configuration not found for this place',
            ], 404);
        }

        $config->delete();

        return response()->json([
            'message' => 'Configuration deleted successfully',
        ]);
    }

    /**
     * Get the default theme configuration.
     */
    public function default(): JsonResponse
    {
        $defaultConfig = Config::query()
            ->whereNull('place_id')
            ->first();

        return response()->json([
            'data' => $defaultConfig ? $defaultConfig->content : config('default-theme'),
        ]);
    }
}
