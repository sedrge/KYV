<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultConfig = config('default-theme');

        \App\Models\Installation\Config::create([
            'content' => $defaultConfig,
            'place_id' => null,
        ]);
    }
}
