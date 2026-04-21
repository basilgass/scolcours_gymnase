<?php

namespace Database\Seeders;

use App\Models\Challenge;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChallengeHallOfFameSeeder extends Seeder
{
    private const CHALLENGE_ID = 9;

    public function run(): void
    {
        $challenge = Challenge::findOrFail(self::CHALLENGE_ID);
        $users     = User::all();

        $challenge->scores()->whereIn('user_id', $users->pluck('id'))->delete();

        $this->command->info("Scores supprimés pour {$users->count()} utilisateurs (challenge #" . self::CHALLENGE_ID . ").");

        foreach ($users as $user) {
            $level = fake()->numberBetween(1, 3);

            $challenge->scores()->create([
                'user_id'     => $user->id,
                'score'       => fake()->numberBetween(0, 1000),
                'attempts'    => fake()->numberBetween(1, 15),
                'is_resolved' => fake()->boolean(40),
                'data'        => [
                    'level'         => $level,
                    'current_level' => $level,
                    'current_score' => fake()->numberBetween(0, 500),
                ],
                'created_at'  => fake()->dateTimeBetween('-60 days', '-30 days'),
                'updated_at'  => fake()->dateTimeBetween('-30 days', 'now'),
            ]);
        }

        $this->command->info("Scores aléatoires créés pour {$users->count()} utilisateurs.");
    }
}