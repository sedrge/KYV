<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Visitor>
 */
class VisitorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'date_of_birth' => fake()->date(),
            'place_of_birth' => fake()->city(),
            'father_name' => fake()->name('male'),
            'mother_name' => fake()->name('female'),
            'profession' => fake()->jobTitle(),
            'home_address' => fake()->address(),
            'number_of_children' => fake()->numberBetween(0, 5),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => fake()->phoneNumber(),
            'emergency_contact_country_code' => '+225',
            'phone_number' => fake()->phoneNumber(),
            'phone_country_code' => '+225',
            'email' => fake()->unique()->safeEmail(),
            'travel_type' => fake()->randomElement(['International', 'National']),
            'document_type' => fake()->randomElement(['Passport', 'ID Card', 'Driver License']),
            'document_number' => fake()->bothify('??-########'),
            'nationality' => fake()->country(),
            'document_scan_path' => null,
            'selfie_path' => null,
            'signature_path' => null,
            'arrival_date' => fake()->date(),
            'arrival_time' => fake()->time(),
            'departure_date' => fake()->date(),
            'departure_time' => fake()->time(),
            'travel_reason' => fake()->randomElement(['Affaires', 'Tourisme', 'Famille', 'Études']),
            'next_destination' => fake()->city(),
        ];
    }
}
