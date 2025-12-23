<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PassportOCRController extends Controller
{
    public function process(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        try {
            $path = $request->file('image')->store('temp_ocr');
            
            // Correction chemin : On s'assure que le chemin est compatible Windows
            $fullPath = str_replace('/', DIRECTORY_SEPARATOR, storage_path('app/private/' . $path));

            // ... 
            $python = "C:/Users/User/Desktop/KYV/ocr/venv/Scripts/python.exe";
            $script = "C:/Users/User/Desktop/KYV/ocr/ocr.py";

            // On définit manuellement les dossiers de l'utilisateur "User"
            $userPath = "C:/Users/User"; 

            $env = [
                'SYSTEMROOT' => getenv('SYSTEMROOT'),
                'PATH' => getenv('PATH'),
                'PYTHONIOENCODING' => 'utf-8',
                'HOME' => $userPath,
                'USERPROFILE' => $userPath,
                'HOMEDRIVE' => 'C:',
                'HOMEPATH' => '/Users/User',
                'MODELSCOPE_CACHE' => $userPath . '/.cache/modelscope', // Pour éviter l'erreur modelscope
            ];

            // Utilisation de env() pour injecter ces variables
            $result = Process::env($env)->run("\"$python\" \"$script\" \"$fullPath\"");
// ...

            // ------------------------

            Storage::delete($path);

            $output = $result->output();
            $errorOutput = $result->errorOutput();

            $cleanOutput = mb_convert_encoding($output, 'UTF-8', 'UTF-8');
            $cleanError = mb_convert_encoding($errorOutput, 'UTF-8', 'UTF-8');

            if (!$result->successful()) {
                Log::error("Erreur Python OCR: " . $cleanError);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Le script OCR a échoué',
                    'debug' => $cleanError
                ], 500);
            }

            $data = json_decode($cleanOutput, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Réponse JSON invalide',
                    'raw' => $cleanOutput
                ], 500);
            }

            return response()->json($data);

        } catch (\Exception $e) {
            Log::error("Exception OCR: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur serveur : ' . $e->getMessage()
            ], 500);
        }
    }
}
