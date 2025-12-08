<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'place_id' => $this->place_id,
            'place' => new PlaceResource($this->whenLoaded('place')),
            'config' => new ConfigResource($this->whenLoaded('config')),
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'two_factor_confirmed_at' => $this->two_factor_confirmed_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
