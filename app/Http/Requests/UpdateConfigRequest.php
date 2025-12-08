<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateConfigRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'place_id' => ['required', 'exists:places,id', 'unique:configs,place_id,'.$this->route('config')],
            'content' => ['required', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'place_id.required' => 'Le lieu est obligatoire.',
            'place_id.exists' => 'Le lieu sélectionné n\'existe pas.',
            'place_id.unique' => 'Ce lieu a déjà une configuration.',
            'content.required' => 'Le contenu de la configuration est obligatoire.',
            'content.array' => 'Le contenu doit être un tableau.',
        ];
    }
}
