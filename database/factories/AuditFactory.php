<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Audit>
 */
class AuditFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event' => fake()->randomElement(['created', 'updated', 'deleted', 'auth.login', 'auth.logout']),
            'auditable_type' => \App\Models\User::class,
            'auditable_id' => \App\Models\User::factory(),
            'user_id' => \App\Models\User::factory(),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'old_values' => null,
            'new_values' => ['name' => fake()->name(), 'email' => fake()->email()],
            'metadata' => ['status_code' => 200],
            'url' => fake()->url(),
            'http_method' => fake()->randomElement(['GET', 'POST', 'PUT', 'DELETE']),
            'tags' => null,
        ];
    }
}
