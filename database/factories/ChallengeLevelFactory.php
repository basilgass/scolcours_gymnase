<?php

namespace Database\Factories;

use App\Models\Challenge;
use App\Models\ChallengeLevel;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChallengeLevelFactory extends Factory
{
    protected $model = ChallengeLevel::class;

    public function definition(): array
    {
        return [
            'challenge_id' => Challenge::factory(),
            'level_number' => $this->faker->numberBetween(1, 5),
            'points_to_pass' => $this->faker->numberBetween(10, 100),
            'bonus' => null,
        ];
    }
}
