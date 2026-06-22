<?php

namespace Tests\Feature\Teams;

use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TeamApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_teams(): void
    {
        $this->actingAsAdmin();
        Team::factory()->withUsers(2)->create();
        Team::factory()->create();

        $this->getJson(route('api.admin.teams.index'))
            ->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([['id', 'name', 'active', 'users']]);
    }

    public function test_show_returns_a_single_team(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create(['name' => 'alpha', 'active' => true]);

        $this->getJson(route('api.admin.teams.show', $team))
            ->assertStatus(200)
            ->assertJsonPath('id', $team->id)
            ->assertJsonPath('name', 'alpha')
            ->assertJsonPath('active', true);
    }

    public function test_admin_can_store_a_team(): void
    {
        $this->actingAsAdmin();

        // Le défaut modèle ($attributes) fixe active=false dès la création :
        // la resource est cohérente avec la ligne en base.
        $this->postJson(route('api.admin.teams.store'), ['name' => 'nouvelle equipe'])
            ->assertStatus(201)
            ->assertJsonPath('name', 'nouvelle equipe')
            ->assertJsonPath('active', false);

        $this->assertDatabaseHas('teams', ['name' => 'nouvelle equipe', 'active' => false]);
    }

    public function test_store_requires_a_name(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.teams.store'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_store_validates_the_name_length(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.teams.store'), ['name' => 'a'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_admin_can_update_a_team(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create(['name' => 'avant', 'active' => false]);

        $this->patchJson(route('api.admin.teams.update', $team), [
            'name'   => 'apres',
            'active' => true,
        ])->assertStatus(204);

        $fresh = $team->fresh();
        $this->assertSame('apres', $fresh->name);
        $this->assertTrue($fresh->active);
    }

    public function test_admin_can_delete_a_team_and_gets_the_raw_id_back(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create();

        // destroy retourne l'id brut (scalaire), pas une resource.
        $this->deleteJson(route('api.admin.teams.destroy', $team))
            ->assertStatus(200)
            ->assertSee((string) $team->id, false);

        $this->assertModelMissing($team);
    }

    public function test_team_endpoints_require_admin(): void
    {
        $team = Team::factory()->create();

        $this->getJson(route('api.admin.teams.index'))->assertStatus(401);
        $this->getJson(route('api.admin.teams.show', $team))->assertStatus(401);
        $this->postJson(route('api.admin.teams.store'), [])->assertStatus(401);
        $this->patchJson(route('api.admin.teams.update', $team), [])->assertStatus(401);
        $this->deleteJson(route('api.admin.teams.destroy', $team))->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.teams.index'))->assertForbidden();
        $this->getJson(route('api.admin.teams.show', $team))->assertForbidden();
        $this->postJson(route('api.admin.teams.store'), [])->assertForbidden();
        $this->patchJson(route('api.admin.teams.update', $team), [])->assertForbidden();
        $this->deleteJson(route('api.admin.teams.destroy', $team))->assertForbidden();
    }
}
