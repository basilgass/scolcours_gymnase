<?php

namespace Tests\Feature\Evaluations;

use App\Models\Evaluation;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EvaluationWebTest extends TestCase
{
    use RefreshDatabase;

    // --- admin -----------------------------------------------------------

    public function test_admin_index_lists_evaluations_and_active_teams(): void
    {
        $this->actingAsAdmin();
        $evaluation = Evaluation::factory()->create();
        Team::factory()->create();              // active → listée
        Team::factory()->inactive()->create();  // inactive → exclue

        $this->get(route('admin.evaluations.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Evaluations/admin/AdminEvaluation')
                ->has('evaluations', 1)
                ->where('evaluations.0.id', $evaluation->id)
                ->has('teams', 1)
            );
    }

    public function test_admin_show_renders_the_admin_resource_with_teams(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create();
        $evaluation = Evaluation::factory()->withTeam($team)->create();

        $this->get(route('admin.evaluations.show', $evaluation))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Evaluations/admin/AdminEvaluationShow')
                ->where('evaluation.id', $evaluation->id)
                ->has('evaluation.teams', 1)
            );
    }

    public function test_admin_edit_renders_the_edit_page(): void
    {
        $this->actingAsAdmin();
        $evaluation = Evaluation::factory()->create();

        $this->get(route('admin.evaluations.edit', $evaluation))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Evaluations/EvaluationEdit')
                ->where('evaluation.id', $evaluation->id)
            );
    }

    public function test_admin_routes_are_redirected_for_guests(): void
    {
        $evaluation = Evaluation::factory()->create();

        $this->get(route('admin.evaluations.index'))->assertStatus(302);
        $this->get(route('admin.evaluations.show', $evaluation))->assertStatus(302);
        $this->get(route('admin.evaluations.edit', $evaluation))->assertStatus(302);
    }

    public function test_admin_routes_are_forbidden_for_non_admins(): void
    {
        $this->actingAsUser();
        $evaluation = Evaluation::factory()->create();

        $this->get(route('admin.evaluations.index'))->assertForbidden();
        $this->get(route('admin.evaluations.show', $evaluation))->assertForbidden();
        $this->get(route('admin.evaluations.edit', $evaluation))->assertForbidden();
    }

    // --- élève -----------------------------------------------------------

    public function test_student_index_lists_only_evaluations_of_the_user_teams(): void
    {
        $user = $this->actingAsUser();
        $team = Team::factory()->create();
        $team->users()->attach($user);

        $mine = Evaluation::factory()->withTeam($team)->create();
        // Évaluation rattachée à une autre équipe : ne doit pas apparaître.
        Evaluation::factory()->withTeam(Team::factory()->create())->create();

        $this->get(route('students.evaluations.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Evaluations/EvaluationIndex')
                ->has('evaluations', 1)
                ->where('evaluations.0.id', $mine->id)
            );
    }

    public function test_student_show_renders_the_evaluation(): void
    {
        $this->actingAsUser();
        $evaluation = Evaluation::factory()->create();

        $this->get(route('students.evaluations.show', $evaluation))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Evaluations/EvaluationShow')
                ->where('evaluation.id', $evaluation->id)
            );
    }

    public function test_student_routes_are_redirected_for_guests(): void
    {
        $evaluation = Evaluation::factory()->create();

        $this->get(route('students.evaluations.index'))->assertStatus(302);
        $this->get(route('students.evaluations.show', $evaluation))->assertStatus(302);
    }
}
