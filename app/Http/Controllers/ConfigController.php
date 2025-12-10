<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConfigRequest;
use App\Http\Requests\UpdateConfigRequest;
use App\Models\Installation\Config;
use App\Models\Place;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ConfigController extends Controller
{
    public function index(): Response
    {
        $configs = Config::query()
            ->latest()
            ->get();

        return Inertia::render('Configs/Index', [
            'configs' => $configs,
        ]);
    }

    public function create(): Response
    {
        $places = Place::query()
            ->active()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Configs/Create', [
            'places' => $places,
        ]);
    }

    public function store(StoreConfigRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $imageFields = ['logo_light', 'logo_dark', 'favicon', 'background_login', 'background_dashboard'];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $path = $request->file($field)->store('configs', 'public');
                $validated[$field] = $path;
            }
        }

        Config::create([
            'content' => $validated,
            'place_id' => $validated['place_id'] ?? null,
        ]);

        return redirect()->route('configs.index')
            ->with('success', 'Configuration créée avec succès.');
    }

    public function show(Config $config): Response
    {
        return Inertia::render('Configs/Show', [
            'config' => $config,
        ]);
    }

    public function edit(Config $config): Response
    {
        $places = Place::query()
            ->active()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Configs/Edit', [
            'config' => $config,
            'places' => $places,
        ]);
    }

    public function update(UpdateConfigRequest $request, Config $config): RedirectResponse
    {
        $validated = $request->validated();

        $imageFields = ['logo_light', 'logo_dark', 'favicon', 'background_login', 'background_dashboard'];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                if (isset($config->content[$field]) && Storage::disk('public')->exists($config->content[$field])) {
                    Storage::disk('public')->delete($config->content[$field]);
                }

                $path = $request->file($field)->store('configs', 'public');
                $validated[$field] = $path;
            } elseif (isset($config->content[$field])) {
                $validated[$field] = $config->content[$field];
            }
        }

        $config->update([
            'content' => $validated,
            'place_id' => $validated['place_id'] ?? $config->place_id,
        ]);

        return redirect()->route('configs.index')
            ->with('success', 'Configuration mise à jour avec succès.');
    }

    public function destroy(Config $config): RedirectResponse
    {
        $config->delete();

        return redirect()->route('configs.index')
            ->with('success', 'Configuration supprimée avec succès.');
    }
}
