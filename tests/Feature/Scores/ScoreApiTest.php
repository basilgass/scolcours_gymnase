<?php

namespace Tests\Feature\Scores;

use App\Models\Challenge;
use App\Models\Score;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScoreApiTest extends TestCase
{
    use RefreshDatabase;

    // --- index -----------------------------------------------------------

    public function test_index_without_type_returns_scores_by_ids(): void
    {
        $user = $this->actingAsUser();
        // Contrainte unique scores(user_id, scoreable_id, scoreable_type) :
        // un score par scorable par utilisateur → deux challenges distincts.
        $s1 = Score::factory()->forScoreable(Challenge::factory()->create())->forUser($user)->create();
        $s2 = Score::factory()->forScoreable(Challenge::factory()->create())->forUser($user)->create();
        Score::factory()->create(); // hors ids

        $response = $this->getJson(route('api.students.scores.index', [
            'ids' => [$s1->id, $s2->id],
        ]))->assertStatus(200);

        $this->assertCount(2, $response->json());
    }

    public function test_index_with_type_creates_missing_scores_at_zero(): void
    {
        $user = $this->actingAsUser();
        $challenge = Challenge::factory()->create();

        $response = $this->getJson(route('api.students.scores.index', [
            'type' => 'challenge',
            'ids'  => [$challenge->id],
        ]))->assertStatus(200);

        $this->assertCount(1, $response->json());
        $this->assertDatabaseHas('scores', [
            'user_id'        => $user->id,
            'scoreable_type' => Challenge::class,
            'scoreable_id'   => $challenge->id,
            'score'          => 0,
        ]);
    }

    public function test_index_with_type_merges_existing_and_missing(): void
    {
        $user = $this->actingAsUser();
        $c1 = Challenge::factory()->create();
        $c2 = Challenge::factory()->create();
        Score::factory()->forScoreable($c1)->forUser($user)->create(['score' => 42]);

        $response = $this->getJson(route('api.students.scores.index', [
            'type' => 'challenge',
            'ids'  => [$c1->id, $c2->id],
        ]))->assertStatus(200);

        $this->assertCount(2, $response->json());
        // c2 a été créé à 0.
        $this->assertDatabaseHas('scores', [
            'scoreable_id' => $c2->id,
            'user_id'      => $user->id,
            'score'        => 0,
        ]);
    }

    public function test_index_validates_required_ids(): void
    {
        $this->actingAsUser();

        $this->getJson(route('api.students.scores.index'))
            ->assertStatus(422)->assertJsonValidationErrors(['ids']);
    }

    public function test_index_admin_can_target_another_user(): void
    {
        $this->actingAsAdmin();
        $target = User::factory()->create();
        $challenge = Challenge::factory()->create();

        $this->getJson(route('api.students.scores.index', [
            'type'    => 'challenge',
            'ids'     => [$challenge->id],
            'user_id' => $target->id,
        ]))->assertStatus(200);

        // Le score manquant est créé pour l'utilisateur ciblé, pas pour l'admin.
        $this->assertDatabaseHas('scores', [
            'user_id'      => $target->id,
            'scoreable_id' => $challenge->id,
        ]);
    }

    public function test_index_requires_authentication(): void
    {
        $this->getJson(route('api.students.scores.index', ['ids' => [1]]))
            ->assertStatus(401);
    }

    // --- show ------------------------------------------------------------

    public function test_show_returns_the_score(): void
    {
        $user = $this->actingAsUser();
        $score = Score::factory()->forUser($user)->create(['score' => 77]);

        // JsonResource::withoutWrapping() est actif globalement → pas de clé "data".
        $this->getJson(route('api.students.scores.show', $score))
            ->assertStatus(200)
            ->assertJsonPath('id', $score->id)
            ->assertJsonPath('score', 77);
    }

    public function test_show_requires_authentication(): void
    {
        $score = Score::factory()->create();

        $this->getJson(route('api.students.scores.show', $score))->assertStatus(401);
    }

    // --- update ----------------------------------------------------------

    public function test_update_persists_score_and_increments_attempts(): void
    {
        $user = $this->actingAsUser();
        $challenge = Challenge::factory()->create();
        $score = Score::factory()->forScoreable($challenge)->forUser($user)
            ->create(['score' => 10, 'attempts' => 2]);

        $this->patchJson(route('api.students.scores.update', $score), [
            'score'    => 50,
            'attempts' => 2,
        ])->assertStatus(200);

        $score->refresh();
        $this->assertEquals(50, $score->score);
        // attempts envoyé = 2 → incrémenté à 3.
        $this->assertSame(3, $score->attempts);
    }

    public function test_update_without_attempts_increments_existing_value(): void
    {
        $user = $this->actingAsUser();
        $challenge = Challenge::factory()->create();
        $score = Score::factory()->forScoreable($challenge)->forUser($user)
            ->create(['score' => 10, 'attempts' => 5]);

        // attempts non envoyé (nullable) alors que le score en a déjà : ne doit pas
        // planter et doit incrémenter la valeur courante (bug corrigé dans le lot).
        $this->patchJson(route('api.students.scores.update', $score), [
            'score' => 20,
        ])->assertStatus(200);

        $this->assertSame(6, $score->fresh()->attempts);
    }

    public function test_update_requires_authentication(): void
    {
        $score = Score::factory()->create();

        $this->patchJson(route('api.students.scores.update', $score), ['score' => 1])
            ->assertStatus(401);
    }

    // --- reset -----------------------------------------------------------

    public function test_reset_route_is_currently_unreachable(): void
    {
        // DETTE B4 : la route PATCH scores/reset est masquée par scores/{score}
        // (update), donc {score}='reset' → 404 (ModelNotFound). De plus reset(Score)
        // n'a aucun paramètre de route et le frontend ne l'appelle pas (resetScore
        // passe par updateScore). Code mort + cassé : à supprimer en B4. On fige le 404.
        $this->actingAsUser();
        $score = Score::factory()->create(['score' => 90, 'attempts' => 4]);

        $this->patchJson(route('api.students.scores.reset', ['score' => $score->id]))
            ->assertStatus(404);

        // Le score n'a pas été réinitialisé : la méthode reset() n'est jamais atteinte.
        $this->assertEquals(90, $score->fresh()->score);
    }

    // --- destroyMultiple (admin) -----------------------------------------

    public function test_destroy_multiple_deletes_listed_scores(): void
    {
        $this->actingAsAdmin();
        $s1 = Score::factory()->create();
        $s2 = Score::factory()->create();
        $kept = Score::factory()->create();

        $this->deleteJson(route('api.admin.scores.bulk'), ['ids' => [$s1->id, $s2->id]])
            ->assertNoContent();

        $this->assertModelMissing($s1);
        $this->assertModelMissing($s2);
        $this->assertModelExists($kept);
    }

    public function test_destroy_multiple_requires_admin(): void
    {
        $score = Score::factory()->create();

        $this->deleteJson(route('api.admin.scores.bulk'), ['ids' => [$score->id]])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.scores.bulk'), ['ids' => [$score->id]])
            ->assertForbidden();

        $this->assertModelExists($score);
    }
}
