<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MrzController extends Controller
{
    public function index()
    {
        return Inertia::render('MrzScan');
    }

    public function parse(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120'
        ]);

        // Stocker temporairement l'image pour que le frontend JS puisse la lire
        $path = $request->file('image')->store('temp');

        // Retourner le chemin public
        $url = Storage::url($path);

        return response()->json([
            'image_url' => $url
        ]);
    }
}

