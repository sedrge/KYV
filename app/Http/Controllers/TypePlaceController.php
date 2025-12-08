<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTypePlaceRequest;
use App\Http\Requests\UpdateTypePlaceRequest;
use App\Models\TypePlace;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TypePlaceController extends Controller
{
    public function index(): Response
    {
        $typePlaces = TypePlace::query()
            ->withCount('places')
            ->latest()
            ->get();

        return Inertia::render('TypePlaces/Index', [
            'typePlaces' => $typePlaces,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('TypePlaces/Create');
    }

    public function store(StoreTypePlaceRequest $request): RedirectResponse
    {
        TypePlace::create($request->validated());

        return redirect()->route('type-places.index')
            ->with('success', 'Type de lieu créé avec succès.');
    }

    public function show(TypePlace $typePlace): Response
    {
        $typePlace->load(['places' => function ($query) {
            $query->latest()->limit(10);
        }]);

        return Inertia::render('TypePlaces/Show', [
            'typePlace' => $typePlace,
        ]);
    }

    public function edit(TypePlace $typePlace): Response
    {
        return Inertia::render('TypePlaces/Edit', [
            'typePlace' => $typePlace,
        ]);
    }

    public function update(UpdateTypePlaceRequest $request, TypePlace $typePlace): RedirectResponse
    {
        $typePlace->update($request->validated());

        return redirect()->route('type-places.index')
            ->with('success', 'Type de lieu mis à jour avec succès.');
    }

    public function destroy(TypePlace $typePlace): RedirectResponse
    {
        if ($typePlace->places()->exists()) {
            return redirect()->route('type-places.index')
                ->with('error', 'Impossible de supprimer ce type de lieu car il est utilisé par des lieux.');
        }

        $typePlace->delete();

        return redirect()->route('type-places.index')
            ->with('success', 'Type de lieu supprimé avec succès.');
    }
}
