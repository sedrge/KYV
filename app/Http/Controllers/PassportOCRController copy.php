<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

class PassportOCRController extends Controller
{
    public function process12(Request $request)
    {
        // 1. Validation de l'image
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png|max:5120',
        ]);

        // 2. Stockage temporaire de l'image
        $path = $request->file('image')->store('temp_ocr');
        $fullPath = storage_path('app/' . $path);

        // 3. Appel du script Python (adapter les chemins)
        // Note : On utilise l'exécutable python du venv
        $pythonPath = "C:/Users/User/Desktop/KYV/ocr/venv/Scripts/python.exe";
        $scriptPath = "C:/Users/User/Desktop/KYV/ocr/ocr.py";

        $result = Process::run("$pythonPath $scriptPath $fullPath");

        // 4. Suppression de l'image temporaire
        Storage::delete($path);

        // 5. Retour du JSON à React
        if ($result->successful()) {
            return response()->json(json_decode($result->output()));
        }

        return response()->json(['status' => 'error', 'message' => 'Erreur lors du scan'], 500);
    }

    public function process123(Request $request)
{
    try {
        $path = $request->file('image')->store('temp_ocr');
        $fullPath = storage_path('app/' . $path);

        $pythonPath = "C:\\Users\\User\\Desktop\\KYV\\ocr\\venv\\Scripts\\python.exe";
        $scriptPath = "C:\\Users\\User\\Desktop\\KYV\\ocr\\ocr.py";

        // On utilise run() et on capture la sortie
        //$result = Process::run("$pythonPath $scriptPath $fullPath");
        $result = Process::run("\"$pythonPath\" \"$scriptPath\" \"$fullPath\"");

        // Supprimer le fichier après usage
        Storage::delete($path);

        if (!$result->successful()) {
            // Renvoie l'erreur Python réelle à React pour débugger
            return response()->json([
                'status' => 'error',
                'error' => $result->errorOutput(), // Très important pour voir l'erreur Python
                'output' => $result->output()
            ], 500);
        }

        return response()->json(json_decode($result->output()));

    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}

public function process(Request $request)
{
    $path = $request->file('image')->store('temp_ocr');
    $fullPath = storage_path('app/' . $path);

    // Utilisez des chemins propres
    $python = "C:/Users/User/Desktop/KYV/ocr/venv/Scripts/python.exe";
    $script = "C:/Users/User/Desktop/KYV/ocr/ocr.py";

    // On lance la commande
    $result = \Illuminate\Support\Facades\Process::run("\"$python\" \"$script\" \"$fullPath\"");

    // Nettoyage immédiat
    \Illuminate\Support\Facades\Storage::delete($path);

    // Si le script Python a échoué (erreur de bibliothèque, chemin, etc.)
    if (!$result->successful()) {
        return response()->json([
            'status' => 'error',
            'debug_error' => $result->errorOutput(), // Ceci vous dira l'erreur Python exacte
            'command' => "$python $script $fullPath"
        ], 500);
    }

    return response()->json(json_decode($result->output()));
}


}
