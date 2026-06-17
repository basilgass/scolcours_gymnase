<?php

namespace Database\Factories;

use App\Models\Challenge;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChallengeFactory extends Factory
{
    protected $model = Challenge::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'title' => $this->faker->sentence(3),
            'active' => false,
            'type' => 'classic',
            'time_limit' => 5,
            'lives' => 3,
        ];
    }
}
