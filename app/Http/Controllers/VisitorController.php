<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVisitorRequest;
use App\Http\Requests\UpdateVisitorRequest;
use App\Models\Visitor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VisitorController extends Controller
{
    public function index(): Response
    {
        $visitors = Visitor::query()
            ->latest()
            ->get()
            ->map(fn ($visitor) => [
                'id' => $visitor->id,
                'first_name' => $visitor->first_name,
                'last_name' => $visitor->last_name,
                'document_type' => $visitor->document_type,
                'document_number' => $visitor->document_number,
                'nationality' => $visitor->nationality,
                'arrival_date' => $visitor->arrival_date,
                'departure_date' => $visitor->departure_date,
                'created_at' => $visitor->created_at,
            ]);

        return Inertia::render('Visitors/Index', [
            'visitors' => $visitors,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Visitors/Create');
    }

    public function store(StoreVisitorRequest $request): RedirectResponse
    {
        $validated = $request->validated();

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

        return redirect()->route('visitors.index')
            ->with('success', 'Visiteur enregistré avec succès.');
    }

    public function show(Visitor $visitor): Response
    {
        return Inertia::render('Visitors/Show', [
            'visitor' => $visitor,
        ]);
    }

    public function edit(Visitor $visitor): Response
    {
        return Inertia::render('Visitors/Edit', [
            'visitor' => $visitor,
        ]);
    }

    public function update(UpdateVisitorRequest $request, Visitor $visitor): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('document_scan')) {
            if ($visitor->document_scan_path) {
                Storage::disk('public')->delete($visitor->document_scan_path);
            }
            $validated['document_scan_path'] = $request->file('document_scan')->store('visitors/documents', 'public');
        }

        if ($request->hasFile('selfie')) {
            if ($visitor->selfie_path) {
                Storage::disk('public')->delete($visitor->selfie_path);
            }
            $validated['selfie_path'] = $request->file('selfie')->store('visitors/selfies', 'public');
        }

        if ($request->hasFile('signature')) {
            if ($visitor->signature_path) {
                Storage::disk('public')->delete($visitor->signature_path);
            }
            $validated['signature_path'] = $request->file('signature')->store('visitors/signatures', 'public');
        }

        unset($validated['document_scan'], $validated['selfie'], $validated['signature']);

        $visitor->update($validated);

        return redirect()->route('visitors.index')
            ->with('success', 'Visiteur mis à jour avec succès.');
    }

    public function destroy(Visitor $visitor): RedirectResponse
    {
        if ($visitor->document_scan_path) {
            Storage::disk('public')->delete($visitor->document_scan_path);
        }

        if ($visitor->selfie_path) {
            Storage::disk('public')->delete($visitor->selfie_path);
        }

        if ($visitor->signature_path) {
            Storage::disk('public')->delete($visitor->signature_path);
        }

        $visitor->delete();

        return redirect()->route('visitors.index')
            ->with('success', 'Visiteur supprimé avec succès.');
    }
}
