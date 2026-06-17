<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeamFactory extends Factory
{
    protected $model = Team::class;

    public function definition(): array
    {
        return [
            'name'   => $this->faker->unique()->words(2, true),
            'active' => true,
        ];
    }

    /**
     * Équipe désactivée (exclue du scope Team::active()).
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes): array => ['active' => false]);
    }

    /**
     * Rattache des utilisateurs à l'équipe (pivot team_user).
     */
    public function withUsers(int $count = 2): static
    {
        return $this->afterCreating(function (Team $team) use ($count): void {
            $team->users()->attach(User::factory()->count($count)->create());
        });
    }
}
