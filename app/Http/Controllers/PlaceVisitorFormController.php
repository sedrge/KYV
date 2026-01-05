<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVisitorRequest;
use App\Models\Place;
use App\Models\Visitor;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PlaceVisitorFormController extends Controller
{
    public function create(Place $place): Response
    {
        $place->load('typePlace');

        return Inertia::render('Public/PlaceVisitorCreate', [
            'place' => $place,
        ]);
    }

    public function store(StoreVisitorRequest $request, Place $place): RedirectResponse
    {
        $validated = $request->validated();

        $validated['place_id'] = $place->id;

        if ($request->hasFile('document_scan')) {
            $validated['document_scan_path'] = $request->file('document_scan')->store('visitors/documents', 'public');
        }

        if ($request->hasFile('selfie')) {
            $validated['selfie_path'] = $request->file('selfie')->store('visitors/selfies', 'public');
        }

        if ($request->hasFile('signature')) {
            $validated['signature_path'] = $request->file('signature')->store('visitors/signatures', 'public');
        }

        unset($validated['document_scan'], $validated['selfie'], $validated['signature']);

        Visitor::create($validated);

        return redirect()->route('place.visitor.success', ['place' => $place->id])
            ->with('success', 'Visiteur enregistré avec succès.');
    }
}
