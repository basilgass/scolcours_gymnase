<?php

namespace Tests\Feature\Scores;

use App\Models\Challenge;
use App\Models\Score;
use App\Models\Team;
use App\Models\User;
use App\Support\ScoreLeaderboard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScoreLeaderboardTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Crée un score attaché au challenge pour un utilisateur donné.
     */
    private function score(Challenge $challenge, int $score, int $attempts, ?User $user = null): Score
    {
        return Score::factory()
            ->forScoreable($challenge)
            ->forUser($user ?? User::factory()->create())
            ->create(['score' => $score, 'attempts' => $attempts]);
    }

    private function freshChallenge(Challenge $challenge): Challenge
    {
        return Challenge::find($challenge->id);
    }

    public function test_top_stats_orders_by_score_desc_and_limits(): void
    {
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 50, 1);
        $this->score($challenge, 100, 1);
        $this->score($challenge, 75, 1);

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))->topStats(2);

        $this->assertCount(2, $stats->scores);
        $this->assertEquals(100, $stats->scores[0]->score);
        $this->assertEquals(75, $stats->scores[1]->score);
        $this->assertSame(3, $stats->total);
    }

    public function test_top_stats_excludes_scores_without_attempts(): void
    {
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 100, 1);
        // Score jamais tenté (attempts null) → exclu du classement et des stats.
        Score::factory()->forScoreable($challenge)->create(['score' => 999, 'attempts' => null]);

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))->topStats(10);

        $this->assertSame(1, $stats->total);
        $this->assertSame(100.0, (float) $stats->average);
    }

    public function test_top_stats_average_over_attempted_scores(): void
    {
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 10, 1);
        $this->score($challenge, 20, 1);
        $this->score($challenge, 60, 1);

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))->topStats(10);

        $this->assertSame(30.0, (float) $stats->average);
    }

    public function test_median_with_odd_count(): void
    {
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 10, 1);
        $this->score($challenge, 30, 1);
        $this->score($challenge, 80, 1);

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))->topStats(10);

        $this->assertSame(30.0, $stats->median);
    }

    public function test_median_with_even_count(): void
    {
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 10, 1);
        $this->score($challenge, 20, 1);
        $this->score($challenge, 40, 1);
        $this->score($challenge, 60, 1);

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))->topStats(10);

        // Médiane de [10,20,40,60] = (20+40)/2 = 30.
        $this->assertSame(30.0, $stats->median);
    }

    public function test_rank_uses_attempts_as_tiebreaker(): void
    {
        $challenge = Challenge::factory()->create();
        $userA = User::factory()->create();
        $this->score($challenge, 100, 2, $userA); // user observé
        $this->score($challenge, 90, 1);           // moins bon (score inférieur)
        $this->score($challenge, 100, 1);          // meilleur (même score, moins d'essais)

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))
            ->withUser($userA)
            ->topStats(10);

        // Un seul score strictement meilleur → rang 2.
        $this->assertSame(2, $stats->rank);
    }

    public function test_rank_is_null_without_user(): void
    {
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 100, 1);

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))->topStats(10);

        $this->assertNull($stats->rank);
    }

    public function test_rank_is_null_when_user_has_no_attempted_score(): void
    {
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 100, 1);
        $stranger = User::factory()->create();

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))
            ->withUser($stranger)
            ->topStats(10);

        $this->assertNull($stats->rank);
    }

    public function test_team_stats_is_null_without_teams(): void
    {
        $challenge = Challenge::factory()->create();
        $this->score($challenge, 100, 1);

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))->teamStats();

        $this->assertNull($stats);
    }

    public function test_team_stats_filters_to_team_users(): void
    {
        $challenge = Challenge::factory()->create();
        $member = User::factory()->create();
        $outsider = User::factory()->create();
        $this->score($challenge, 80, 1, $member);
        $this->score($challenge, 200, 1, $outsider);

        $team = Team::factory()->create();
        $team->users()->attach($member);

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))
            ->withTeams([$team->fresh()])
            ->teamStats();

        $this->assertNotNull($stats);
        $this->assertSame(1, $stats->total);
        $this->assertEquals(80, $stats->scores[0]->score);
        $this->assertSame(80.0, (float) $stats->average);
    }

    public function test_chrono_type_still_ranks_descending_due_to_property_exists_quirk(): void
    {
        // type='chrono' devrait trier en ascendant, mais isChronoRanking() utilise
        // property_exists() qui ne voit pas les attributs Eloquent → tri desc maintenu.
        // Comportement figé (dette), non corrigé (un changement de tri impacterait le produit).
        $challenge = Challenge::factory()->create(['type' => 'chrono']);
        $this->score($challenge, 10, 1);
        $this->score($challenge, 90, 1);

        $stats = ScoreLeaderboard::for($this->freshChallenge($challenge))->topStats(10);

        $this->assertEquals(90, $stats->scores[0]->score);
    }
}
