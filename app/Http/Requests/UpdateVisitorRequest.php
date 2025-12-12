<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVisitorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['nullable', 'date'],
            'place_of_birth' => ['nullable', 'string', 'max:255'],
            'father_name' => ['nullable', 'string', 'max:255'],
            'mother_name' => ['nullable', 'string', 'max:255'],
            'profession' => ['nullable', 'string', 'max:255'],
            'home_address' => ['nullable', 'string', 'max:255'],
            'number_of_children' => ['nullable', 'integer', 'min:0'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:255'],
            'emergency_contact_country_code' => ['nullable', 'string', 'max:10'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'phone_country_code' => ['nullable', 'string', 'max:10'],
            'email' => ['nullable', 'email', 'max:255'],
            'travel_type' => ['nullable', 'string', 'max:255'],
            'document_type' => ['required', 'string', 'max:255'],
            'document_number' => ['required', 'string', 'max:255'],
            'nationality' => ['nullable', 'string', 'max:255'],
            'document_scan' => ['nullable', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:10240'],
            'selfie' => ['nullable', 'file', 'mimes:jpeg,jpg,png', 'max:5120'],
            'arrival_date' => ['nullable', 'date'],
            'arrival_time' => ['nullable', 'date_format:H:i'],
            'departure_date' => ['nullable', 'date'],
            'departure_time' => ['nullable', 'date_format:H:i'],
            'travel_reason' => ['nullable', 'string', 'max:255'],
            'next_destination' => ['nullable', 'string', 'max:255'],
            'signature' => ['nullable', 'file', 'mimes:jpeg,jpg,png', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'Le prénom est obligatoire.',
            'last_name.required' => 'Le nom de famille est obligatoire.',
            'document_type.required' => 'Le type de document est obligatoire.',
            'document_number.required' => 'Le numéro de document est obligatoire.',
            'date_of_birth.date' => 'La date de naissance doit être une date valide.',
            'email.email' => 'L\'adresse email doit être valide.',
            'number_of_children.integer' => 'Le nombre d\'enfants doit être un nombre entier.',
            'number_of_children.min' => 'Le nombre d\'enfants ne peut pas être négatif.',
            'document_scan.mimes' => 'Le scan du document doit être un fichier JPEG, JPG, PNG ou PDF.',
            'document_scan.max' => 'Le scan du document ne peut pas dépasser 10 Mo.',
            'selfie.mimes' => 'La photo selfie doit être un fichier JPEG, JPG ou PNG.',
            'selfie.max' => 'La photo selfie ne peut pas dépasser 5 Mo.',
            'arrival_date.date' => 'La date d\'arrivée doit être une date valide.',
            'departure_date.date' => 'La date de sortie doit être une date valide.',
            'arrival_time.date_format' => 'L\'heure d\'arrivée doit être au format HH:MM.',
            'departure_time.date_format' => 'L\'heure de départ doit être au format HH:MM.',
        ];
    }
}
