<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlaceRequest;
use App\Http\Requests\UpdatePlaceRequest;
use App\Models\Place;
use App\Models\TypePlace;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PlaceController extends Controller
{
    public function index(): Response
    {
        $places = Place::query()
            ->with('typePlace')
            ->withCount('users')
            ->latest()
            ->get();

        return Inertia::render('Places/Index', [
            'places' => $places,
        ]);
    }

    public function create(): Response
    {
        $typePlaces = TypePlace::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('Places/Create', [
            'typePlaces' => $typePlaces,
        ]);
    }

    public function store(StorePlaceRequest $request): RedirectResponse
    {
        Place::create([...$request->validated(), 'is_active' => $request->has('is_active') && $request->input('is_active') === 'on' ? true : false]);

        return redirect()->route('places.index')
            ->with('success', 'Lieu créé avec succès.');
    }

    public function show(Place $place): Response
    {
        $place->load([
            'typePlace',
            'users' => function ($query) {
                $query->latest()->limit(10);
            },
            'config',
        ]);

        return Inertia::render('Places/Show', [
            'place' => $place,
        ]);
    }

    public function edit(Place $place): Response
    {
        $typePlaces = TypePlace::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('Places/Edit', [
            'place' => $place,
            'typePlaces' => $typePlaces,
        ]);
    }

    public function update(UpdatePlaceRequest $request, Place $place): RedirectResponse
    {
        $place->update([...$request->validated(), 'is_active' => $request->has('is_active') && $request->input('is_active') === 'on' ? true : false]);

        return redirect()->route('places.index')
            ->with('success', 'Lieu mis à jour avec succès.');
    }

    public function destroy(Place $place): RedirectResponse
    {
        if ($place->users()->exists()) {
            return redirect()->route('places.index')
                ->with('error', 'Impossible de supprimer ce lieu car il a des utilisateurs associés.');
        }

        if ($place->config()->exists()) {
            return redirect()->route('places.index')
                ->with('error', 'Impossible de supprimer ce lieu car il a une configuration associée.');
        }

        $place->delete();

        return redirect()->route('places.index')
            ->with('success', 'Lieu supprimé avec succès.');
    }
}
