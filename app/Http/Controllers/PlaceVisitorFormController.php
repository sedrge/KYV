<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlaceVisitorFormController extends Controller
{
    public function show(Place $place): Response
    {
        $place->load('typePlace');

        return Inertia::render('Public/PlaceVisitorForm', [
            'place' => $place,
        ]);
    }

    public function store(Request $request, Place $place): RedirectResponse
    {
        $validated = $request->validate([
            'place_id' => 'required|exists:places,id',
        ]);

        $validated['place_id'] = $place->id;

        $formDataToSend = new \stdClass;
        foreach ($request->all() as $key => $value) {
            if ($value !== null && $value !== '' && $key !== '_token') {
                $formDataToSend->$key = $value;
            }
        }

        return redirect()->route('visitors.create', ['data' => json_encode($formDataToSend)])
            ->with('success', 'Redirection vers le formulaire visiteur.');
    }
}
