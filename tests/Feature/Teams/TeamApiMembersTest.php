<?php

namespace Tests\Feature\Teams;

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamApiMembersTest extends TestCase
{
    use RefreshDatabase;

    public function test_toggle_attaches_a_user_not_in_the_team(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create();
        $user = User::factory()->create();

        $this->patchJson(route('api.admin.teams.users.toggle', [$team, $user]))
            ->assertStatus(200)
            ->assertJsonPath('user', $user->id);

        $this->assertDatabaseHas('team_user', [
            'team_id' => $team->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_toggle_detaches_a_user_already_in_the_team(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->users()->attach($user);

        $this->patchJson(route('api.admin.teams.users.toggle', [$team, $user]))
            ->assertStatus(200)
            ->assertJsonPath('user', $user->id);

        $this->assertDatabaseMissing('team_user', [
            'team_id' => $team->id,
            'user_id' => $user->id,
        ]);
    }

    public function test_users_lists_the_team_members(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->withUsers(3)->create();

        $this->getJson(route('api.admin.teams.users.index', $team))
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_membership_endpoints_require_admin(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        $this->patchJson(route('api.admin.teams.users.toggle', [$team, $user]))->assertStatus(401);
        $this->getJson(route('api.admin.teams.users.index', $team))->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.teams.users.toggle', [$team, $user]))->assertForbidden();
        $this->getJson(route('api.admin.teams.users.index', $team))->assertForbidden();
    }
}
