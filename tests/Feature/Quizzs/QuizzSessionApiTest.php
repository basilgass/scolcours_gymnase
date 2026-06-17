<?php

namespace Tests\Feature\Quizzs;

use App\Models\Quizz;
use App\Models\QuizzSession;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizzSessionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_the_sessions_of_a_quizz(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();
        $older = QuizzSession::factory()->forQuizz($quizz)->create(['created_at' => now()->subDay()]);
        $newer = QuizzSession::factory()->forQuizz($quizz)->create(['created_at' => now()]);

        $response = $this->getJson(route('api.admin.quizzes.sessions.index', $quizz))
            ->assertStatus(200);

        // Tri décroissant par created_at : la plus récente d'abord (bug #2 du lot,
        // sortBy(..., SORT_DESC) lançait UnhandledMatchError sous Laravel 13 → 500).
        $ids = collect($response->json())->pluck('id');
        $this->assertSame([$newer->id, $older->id], $ids->all());
    }

    public function test_index_requires_admin(): void
    {
        $quizz = Quizz::factory()->create();

        $this->getJson(route('api.admin.quizzes.sessions.index', $quizz))->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.quizzes.sessions.index', $quizz))->assertForbidden();
    }

    public function test_store_creates_a_session_and_attaches_team_users(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();
        $team = Team::factory()->withUsers(2)->create();

        $response = $this->postJson(route('api.admin.quizzes.sessions.store', $quizz), [
            'team' => $team->id,
        ]);

        // store renvoie une Resource depuis un POST → 201.
        $response->assertStatus(201)
            ->assertJsonPath('quizz.id', $quizz->id)
            ->assertJsonCount(2, 'users');

        $session = QuizzSession::firstWhere('quizz_id', $quizz->id);
        $this->assertNotNull($session);
        // Le shortcode est préfixé par le nom de l'équipe.
        $this->assertStringStartsWith($team->name . '-', $session->shortcode);
        $this->assertSame(2, $session->users()->count());
    }

    public function test_store_rejects_an_unknown_team(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();

        $this->postJson(route('api.admin.quizzes.sessions.store', $quizz), [
            'team' => 999999,
        ])->assertStatus(422)->assertJsonValidationErrors(['team']);

        $this->assertSame(0, QuizzSession::count());
    }

    public function test_store_requires_admin(): void
    {
        $quizz = Quizz::factory()->create();
        $team = Team::factory()->withUsers(1)->create();
        $payload = ['team' => $team->id];

        $this->postJson(route('api.admin.quizzes.sessions.store', $quizz), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.quizzes.sessions.store', $quizz), $payload)
            ->assertForbidden();

        $this->assertSame(0, QuizzSession::count());
    }

    public function test_destroy_deletes_the_session(): void
    {
        $this->actingAsAdmin();
        $session = QuizzSession::factory()->create();

        $this->deleteJson(route('api.admin.sessions.destroy', $session))
            ->assertStatus(200);

        $this->assertModelMissing($session);
    }

    public function test_destroy_requires_admin(): void
    {
        $session = QuizzSession::factory()->create();

        $this->deleteJson(route('api.admin.sessions.destroy', $session))->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.sessions.destroy', $session))->assertForbidden();

        $this->assertModelExists($session);
    }

    public function test_show_and_update_are_empty_no_ops(): void
    {
        // Méthodes routées mais à corps vide (dette B4 : code mort partiel).
        // On fige le comportement actuel : réponse 200 sans contenu.
        $this->actingAsAdmin();
        $session = QuizzSession::factory()->create();

        $this->getJson(route('api.admin.sessions.show', $session))->assertStatus(200);
        $this->patchJson(route('api.admin.sessions.update', $session))->assertStatus(200);
    }
}
