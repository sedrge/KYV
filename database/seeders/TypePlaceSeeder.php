<?php

namespace Database\Seeders;

use App\Models\TypePlace;
use Illuminate\Database\Seeder;

class TypePlaceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typePlaces = [
            'Hôtel',
            'Résidence',
            'Auberge',
            'Motel',
            'Camping',
            'Appartement',
            'Villa',
            'Maison de vacances',

            'Hôpital',
            'Clinique',
            'Cabinet médical',
            'Mairie',
            'Commissariat',
            'Gendarmerie',
            'Station-service',
            'Musée',
 
            // Transport
            'Gare',
            'Aéroport',

        ];

        foreach ($typePlaces as $name) {
            TypePlace::create([
                'name' => $name,
            ]);
        }
    }
}
