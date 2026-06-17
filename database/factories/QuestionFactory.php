<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Quizz;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'order'             => 1,
            'keyboard'          => 'standard',
            'answer'            => $this->faker->word(),
            'questionable_type' => Quizz::class,
            'questionable_id'   => Quizz::factory(),
        ];
    }

    /**
     * Crée le block « par défaut » attendu par le rendu (QuestionResource),
     * comme le fait QuestionApiController::store en production. Sans cet état,
     * la question est volontairement sans block pour exercer la branche
     * défensive du resource.
     */
    public function withBlock(): static
    {
        return $this->afterCreating(function (Question $question): void {
            $question->blocks()->create(['body' => 'sans contenu']);
        });
    }

    /**
     * Rattache la question à un hôte polymorphe donné (Quizz, Post, Evaluation…).
     */
    public function forQuestionable(\Illuminate\Database\Eloquent\Model $questionable): static
    {
        return $this->state(fn (array $attributes): array => [
            'questionable_type' => $questionable->getMorphClass(),
            'questionable_id'   => $questionable->getKey(),
        ]);
    }
}