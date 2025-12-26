<?php

namespace App\Http\Requests;

use App\Models\QrCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreQrCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::user()->can('create', QrCode::class);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:2000'],
            'size' => ['nullable', 'integer', 'min:100', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre du QR code est obligatoire.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'url.required' => 'L\'URL est obligatoire.',
            'url.url' => 'L\'URL doit être valide.',
            'url.max' => 'L\'URL ne peut pas dépasser 2000 caractères.',
            'size.integer' => 'La taille doit être un nombre entier.',
            'size.min' => 'La taille minimale est 100 pixels.',
            'size.max' => 'La taille maximale est 1000 pixels.',
        ];
    }
}
