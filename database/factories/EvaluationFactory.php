<?php

namespace Database\Factories;

use App\Models\Evaluation;
use App\Models\Question;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvaluationFactory extends Factory
{
    protected $model = Evaluation::class;

    public function definition(): array
    {
        return [
            'slug'         => $this->faker->unique()->slug(),
            'title'        => $this->faker->sentence(3),
            'body'         => '',
            'randomOrder'  => false,
            'auto_control' => false,
        ];
    }

    /**
     * Rattache l'évaluation à une équipe (pivot evaluation_team).
     */
    public function withTeam(Team $team): static
    {
        return $this->afterCreating(function (Evaluation $evaluation) use ($team): void {
            $evaluation->teams()->attach($team->id);
        });
    }

    /**
     * Ajoute une question polymorphe rattachée à l'évaluation.
     */
    public function withQuestion(): static
    {
        return $this->afterCreating(function (Evaluation $evaluation): void {
            Question::factory()->forQuestionable($evaluation)->create();
        });
    }
}
