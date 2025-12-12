<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    /** @use HasFactory<\Database\Factories\VisitorFactory> */
    use Auditable, HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'date_of_birth',
        'place_of_birth',
        'father_name',
        'mother_name',
        'profession',
        'home_address',
        'number_of_children',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_country_code',
        'phone_number',
        'phone_country_code',
        'email',
        'travel_type',
        'document_type',
        'document_number',
        'nationality',
        'document_scan_path',
        'selfie_path',
        'signature_path',
        'arrival_date',
        'arrival_time',
        'departure_date',
        'departure_time',
        'travel_reason',
        'next_destination',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'arrival_date' => 'date',
            'departure_date' => 'date',
            'number_of_children' => 'integer',
        ];
    }
}
