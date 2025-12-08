<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConfigRequest;
use App\Http\Requests\UpdateConfigRequest;
use App\Models\Installation\Config;
use App\Models\Place;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ConfigController extends Controller
{
    public function index(): Response
    {
        $configs = Config::query()
            ->with('place')
            ->latest()
            ->get();

        return Inertia::render('Configs/Index', [
            'configs' => $configs,
        ]);
    }

    public function create(): Response
    {
        $places = Place::query()
            ->whereDoesntHave('config')
            ->orderBy('name')
            ->get();

        return Inertia::render('Configs/Create', [
            'places' => $places,
        ]);
    }

    public function store(StoreConfigRequest $request): RedirectResponse
    {
        Config::create($request->validated());

        return redirect()->route('configs.index')
            ->with('success', 'Configuration créée avec succès.');
    }

    public function show(Config $config): Response
    {
        $config->load('place');

        return Inertia::render('Configs/Show', [
            'config' => $config,
        ]);
    }

    public function edit(Config $config): Response
    {
        $places = Place::query()
            ->where(function ($query) use ($config) {
                $query->whereDoesntHave('config')
                    ->orWhere('id', $config->place_id);
            })
            ->orderBy('name')
            ->get();

        return Inertia::render('Configs/Edit', [
            'config' => $config,
            'places' => $places,
        ]);
    }

    public function update(UpdateConfigRequest $request, Config $config): RedirectResponse
    {
        $config->update($request->validated());

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
