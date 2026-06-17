<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Score;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

class ScoreFactory extends Factory
{
    protected $model = Score::class;

    public function definition(): array
    {
        return [
            'user_id'        => User::factory(),
            'score'          => $this->faker->numberBetween(0, 100),
            'scoreable_type' => Question::class,
            'scoreable_id'   => Question::factory(),
        ];
    }

    /**
     * Rattache le score à un modèle scorable donné (Question, Challenge…).
     */
    public function forScoreable(Model $scoreable): static
    {
        return $this->state(fn (array $attributes): array => [
            'scoreable_type' => $scoreable->getMorphClass(),
            'scoreable_id'   => $scoreable->getKey(),
        ]);
    }

    /**
     * Rattache le score à un utilisateur existant.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes): array => [
            'user_id' => $user->id,
        ]);
    }
}
