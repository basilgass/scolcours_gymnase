<?php

namespace Tests\Feature\Evaluations;

use App\Models\Evaluation;
use App\Models\Question;
use App\Models\Score;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvaluationApiActionsTest extends TestCase
{
    use RefreshDatabase;

    // --- scores ----------------------------------------------------------

    public function test_scores_returns_team_users_scores_for_evaluation_questions(): void
    {
        $this->actingAsAdmin();
        $evaluation = Evaluation::factory()->create();
        $question = Question::factory()->forQuestionable($evaluation)->create();

        $team = Team::factory()->create(['name' => 'alpha']);
        // La route scores utilise un scoped binding ({team:name} via {evaluation}) :
        // l'équipe doit être rattachée à l'évaluation pour être résolue.
        $evaluation->teams()->attach($team);
        $user = User::factory()->create();
        $team->users()->attach($user);

        // Score sur la question de l'évaluation (doit apparaître).
        Score::factory()->forScoreable($question)->forUser($user)->create(['score' => 10]);
        // Score sur une question hors évaluation (doit être filtré).
        $other = Question::factory()->create();
        Score::factory()->forScoreable($other)->forUser($user)->create(['score' => 99]);

        $response = $this->getJson(route('api.admin.evaluations.teams.scores', [
            'evaluation' => $evaluation,
            'team'       => $team->name,
        ]))->assertStatus(200);

        $this->assertCount(1, $response->json());
        $this->assertSame($user->id, $response->json('0.user.id'));
        $this->assertCount(1, $response->json('0.scores'));
        $this->assertSame(10, $response->json('0.scores.0.score'));
    }

    public function test_scores_lists_a_user_without_matching_scores_as_empty(): void
    {
        $this->actingAsAdmin();
        $evaluation = Evaluation::factory()->create();
        Question::factory()->forQuestionable($evaluation)->create();

        $team = Team::factory()->create(['name' => 'beta']);
        $evaluation->teams()->attach($team);
        $user = User::factory()->create();
        $team->users()->attach($user);

        $response = $this->getJson(route('api.admin.evaluations.teams.scores', [
            'evaluation' => $evaluation,
            'team'       => $team->name,
        ]))->assertStatus(200);

        $this->assertCount(1, $response->json());
        $this->assertSame($user->id, $response->json('0.user.id'));
        $this->assertCount(0, $response->json('0.scores'));
    }

    public function test_scores_requires_admin(): void
    {
        $evaluation = Evaluation::factory()->create();
        $team = Team::factory()->create(['name' => 'gamma']);
        $evaluation->teams()->attach($team);

        $this->getJson(route('api.admin.evaluations.teams.scores', [
            'evaluation' => $evaluation,
            'team'       => $team->name,
        ]))->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.evaluations.teams.scores', [
            'evaluation' => $evaluation,
            'team'       => $team->name,
        ]))->assertForbidden();
    }

    // --- toggleTeam ------------------------------------------------------

    public function test_toggle_team_attaches_then_detaches(): void
    {
        $this->actingAsAdmin();
        $evaluation = Evaluation::factory()->create();
        $team = Team::factory()->create();

        // Premier appel : non rattachée → attache. Le contrôleur renvoie un bool
        // brut : Laravel le caste en chaîne → corps "1" (et non du JSON true).
        $this->patchJson(route('api.admin.evaluations.teams.toggle', [
            'evaluation' => $evaluation,
            'team'       => $team,
        ]))->assertStatus(200)->assertContent('1');

        $this->assertTrue($evaluation->teams()->where('teams.id', $team->id)->exists());

        // Second appel : déjà rattachée → détache. bool false casté → corps vide "".
        $this->patchJson(route('api.admin.evaluations.teams.toggle', [
            'evaluation' => $evaluation,
            'team'       => $team,
        ]))->assertStatus(200)->assertContent('');

        $this->assertFalse($evaluation->teams()->where('teams.id', $team->id)->exists());
    }

    public function test_toggle_team_requires_admin(): void
    {
        $evaluation = Evaluation::factory()->create();
        $team = Team::factory()->create();

        $this->patchJson(route('api.admin.evaluations.teams.toggle', [
            'evaluation' => $evaluation,
            'team'       => $team,
        ]))->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.evaluations.teams.toggle', [
            'evaluation' => $evaluation,
            'team'       => $team,
        ]))->assertForbidden();

        $this->assertFalse($evaluation->teams()->where('teams.id', $team->id)->exists());
    }
}
