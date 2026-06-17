<?php

namespace Database\Factories;

use App\Models\Quizz;
use App\Models\QuizzSession;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class QuizzSessionFactory extends Factory
{
    protected $model = QuizzSession::class;

    public function definition(): array
    {
        return [
            'quizz_id'  => Quizz::factory(),
            'shortcode' => Str::upper($this->faker->unique()->bothify('????-####')),
            'enable'    => false,
            'index'     => 0,
        ];
    }

    /**
     * Session activée (visible côté élève dans QuizzSessionController::index).
     */
    public function enabled(): static
    {
        return $this->state(fn (array $attributes): array => ['enable' => true]);
    }

    /**
     * Positionne le curseur de question (0 = intro, n+1 = outro).
     */
    public function atIndex(int $index): static
    {
        return $this->state(fn (array $attributes): array => ['index' => $index]);
    }

    /**
     * Rattache la session à un quizz existant plutôt que d'en créer un.
     */
    public function forQuizz(Quizz $quizz): static
    {
        return $this->state(fn (array $attributes): array => ['quizz_id' => $quizz->id]);
    }

    /**
     * Inscrit un utilisateur à la session (pivot quizz_session_user).
     */
    public function withUser(User $user): static
    {
        return $this->afterCreating(function (QuizzSession $session) use ($user): void {
            $session->users()->attach($user);
        });
    }
}
