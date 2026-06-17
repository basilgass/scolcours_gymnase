<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\Quizz;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuizzFactory extends Factory
{
    protected $model = Quizz::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
        ];
    }

    /**
     * Rattache le quizz à un chapitre (lui-même rattaché à un thème),
     * pour les chemins qui remontent la chaîne Quizz → Chapter → Theme.
     */
    public function forChapter(): static
    {
        return $this->state(fn (array $attributes): array => [
            'chapter_id' => Chapter::factory(),
        ]);
    }

    /**
     * Crée les deux blocks « intro » et « outro » attendus par QuizzResource,
     * comme le fait QuizzApiController::store en production. Sans cet état, le
     * quizz est volontairement sans block pour exercer la branche défensive.
     */
    public function withBlocks(): static
    {
        return $this->afterCreating(function (Quizz $quizz): void {
            $quizz->blocks()->create(['title' => 'intro']);
            $quizz->blocks()->create(['title' => 'outro']);
        });
    }
}