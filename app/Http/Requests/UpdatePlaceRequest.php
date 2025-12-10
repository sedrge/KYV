<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdatePlaceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::user()->can('update', $this->place);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type_place_id' => ['required', 'exists:type_places,id'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'description' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'website' => ['nullable', 'url', 'max:500'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'is_active' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom du lieu est obligatoire.',
            'type_place_id.required' => 'Le type de lieu est obligatoire.',
            'type_place_id.exists' => 'Le type de lieu sélectionné n\'existe pas.',
            'email.email' => 'L\'adresse email doit être valide.',
            'latitude.between' => 'La latitude doit être entre -90 et 90.',
            'longitude.between' => 'La longitude doit être entre -180 et 180.',
            'website.url' => 'L\'URL du site web doit être valide.',
            'rating.between' => 'La note doit être entre 0 et 5.',
        ];
    }
}
