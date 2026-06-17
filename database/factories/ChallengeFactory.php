<?php

namespace Database\Factories;

use App\Models\Challenge;
use App\Models\Chapter;
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

    /**
     * Rattache le challenge à un chapitre (lui-même rattaché à un thème),
     * pour les chemins qui remontent la chaîne Challenge → Chapter → Theme.
     */
    public function forChapter(): static
    {
        return $this->state(fn (array $attributes): array => [
            'chapter_id' => Chapter::factory(),
        ]);
    }
}
