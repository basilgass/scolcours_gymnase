<?php

namespace Tests\Feature\Teams;

use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Generator;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TeamWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_the_team_index(): void
    {
        $this->actingAsAdmin();
        Team::factory()->withUsers(2)->create(['name' => 'alpha']);
        Team::factory()->create(['name' => 'beta']);

        $this->get(route('admin.teams.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Teams/admin/AdminTeamIndex')
                ->has('teams', 2)
                ->where('teams.0.users_count', 2));
    }

    public function test_admin_can_open_a_team_page(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->withUsers(2)->create(['name' => 'alpha']);

        $this->get(route('admin.teams.show', $team))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Teams/admin/AdminTeamShow')
                ->where('team.id', $team->id)
                ->has('students', 2));
    }

    public function test_admin_can_open_the_team_challenge_page(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create(['name' => 'alpha']);
        $challenge = Challenge::factory()->create();

        $this->get(route('admin.teams.challenges.show', [$team, $challenge]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Teams/TeamChallengeShow')
                ->where('team.id', $team->id));
    }

    public function test_admin_can_open_the_team_generator_page(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create(['name' => 'alpha']);
        $generator = Generator::factory()->create();

        $this->get(route('admin.teams.generators.show', [$team, $generator]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Teams/TeamGeneratorShow')
                ->where('team.id', $team->id));
    }

    public function test_admin_can_open_the_team_stats_page(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create(['name' => 'alpha']);
        $chapter = Chapter::factory()->create();

        $this->get(route('admin.teams.chapters.stats', [$team, $chapter]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Teams/TeamPostShow'));
    }

    public function test_team_pages_are_restricted_to_admins(): void
    {
        $team = Team::factory()->create(['name' => 'alpha']);

        $this->get(route('admin.teams.index'))->assertRedirect();
        $this->get(route('admin.teams.show', $team))->assertRedirect();

        $this->actingAsUser();
        $this->get(route('admin.teams.index'))->assertForbidden();
        $this->get(route('admin.teams.show', $team))->assertForbidden();
    }
}
