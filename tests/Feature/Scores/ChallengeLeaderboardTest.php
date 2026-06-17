<?php

namespace Tests\Feature\Scores;

use App\Models\Challenge;
use App\Models\Score;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ChallengeLeaderboardTest extends TestCase
{
    use RefreshDatabase;

    private function score(Challenge $challenge, int $score, int $attempts, ?User $user = null): Score
    {
        return Score::factory()
            ->forScoreable($challenge)
            ->forUser($user ?? User::factory()->create())
            ->create(['score' => $score, 'attempts' => $attempts]);
    }

    // --- web (page Inertia, publique) ------------------------------------

    public function test_web_leaderboard_renders_for_guests(): void
    {
        $challenge = Challenge::factory()->create();

        $this->get(route('challenges.leaderboard.show', $challenge))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Challenges/ChallengeLeaderboard')
                ->where('challenge.id', $challenge->id)
                ->where('teams', [])
            );
    }

    public function test_web_leaderboard_passes_teams_query_through(): void
    {
        $challenge = Challenge::factory()->create();

        $this->get(route('challenges.leaderboard.show', ['challenge' => $challenge, 'teams' => ['alpha']]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->where('teams', ['alpha'])
            );
    }

    // --- api (données, publique) -----------------------------------------

    public function test_api_leaderboard_returns_global_stats_for_guests(): void
    {
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 100, 1);
        $this->score($challenge, 50, 1);

        $response = $this->getJson(route('api.challenges.leaderboard', $challenge))
            ->assertStatus(200);

        $this->assertSame(2, $response->json('global.total'));
        $this->assertCount(2, $response->json('global.scores'));
        // Pas de teams demandées → teamStats null, rank null (invité).
        $this->assertNull($response->json('teamStats'));
        $this->assertNull($response->json('global.rank'));
        $this->assertSame([], $response->json('teams'));
    }

    public function test_api_leaderboard_limits_global_scores_to_ten(): void
    {
        $challenge = Challenge::factory()->create();
        foreach (range(1, 12) as $i) {
            $this->score($challenge, $i * 10, 1);
        }

        $response = $this->getJson(route('api.challenges.leaderboard', $challenge))
            ->assertStatus(200);

        $this->assertSame(12, $response->json('global.total'));
        // topStats(10) → au plus 10 scores renvoyés.
        $this->assertCount(10, $response->json('global.scores'));
    }

    public function test_api_leaderboard_includes_team_stats_when_requested(): void
    {
        $challenge = Challenge::factory()->create();
        $member = User::factory()->create();
        $this->score($challenge, 80, 1, $member);
        $this->score($challenge, 200, 1); // hors équipe

        $team = Team::factory()->create(['name' => 'alpha']);
        $team->users()->attach($member);

        $response = $this->getJson(route('api.challenges.leaderboard', [
            'challenge' => $challenge,
            'teams'     => ['alpha'],
        ]))->assertStatus(200);

        $this->assertSame(1, $response->json('teamStats.total'));
        $this->assertCount(1, $response->json('teamStats.scores'));
        $this->assertCount(1, $response->json('teams'));
    }

    public function test_api_leaderboard_computes_rank_for_authenticated_user(): void
    {
        $user = $this->actingAsUser();
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 50, 1, $user); // l'utilisateur observé
        $this->score($challenge, 100, 1);        // meilleur

        $response = $this->getJson(route('api.challenges.leaderboard', $challenge))
            ->assertStatus(200);

        // Un score strictement meilleur → rang 2.
        $this->assertSame(2, $response->json('global.rank'));
    }
}
