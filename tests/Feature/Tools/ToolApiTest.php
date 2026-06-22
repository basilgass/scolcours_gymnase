<?php

namespace Tests\Feature\Tools;

use App\Models\Tool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ToolApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_is_public_and_exposes_the_tool_shape(): void
    {
        $tool = Tool::factory()->create([
            'title' => 'Calculatrice',
            'slug'  => 'calculatrice',
            'body'  => 'Corps',
        ]);

        $this->getJson(route('api.tools.index'))
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $tool->id)
            ->assertJsonPath('0.title', 'Calculatrice')
            ->assertJsonPath('0.slug', 'calculatrice')
            ->assertJsonPath('0.body', 'Corps')
            ->assertJsonPath('0.parameters', '');
    }

    public function test_admin_index_returns_the_tools(): void
    {
        $this->actingAsAdmin();
        Tool::factory()->count(2)->create();

        $this->getJson(route('api.admin.tools.index'))
            ->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_admin_show_returns_a_single_tool(): void
    {
        $this->actingAsAdmin();
        $tool = Tool::factory()->create();

        $this->getJson(route('api.admin.tools.show', $tool))
            ->assertStatus(200)
            ->assertJsonPath('id', $tool->id);
    }

    public function test_admin_can_update_a_tool(): void
    {
        $this->actingAsAdmin();
        $tool = Tool::factory()->create(['title' => 'Avant', 'body' => 'Avant']);

        $this->patchJson(route('api.admin.tools.update', $tool), [
            'title' => 'Après',
            'body'  => 'Après corps',
        ])->assertStatus(200);

        $fresh = $tool->fresh();
        $this->assertSame('Après', $fresh->title);
        $this->assertSame('Après corps', $fresh->body);
    }

    public function test_update_requires_title_and_body(): void
    {
        $this->actingAsAdmin();
        $tool = Tool::factory()->create();

        $this->patchJson(route('api.admin.tools.update', $tool), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'body']);
    }

    public function test_admin_endpoints_require_admin(): void
    {
        $tool = Tool::factory()->create();

        $this->getJson(route('api.admin.tools.show', $tool))->assertStatus(401);
        $this->patchJson(route('api.admin.tools.update', $tool), [])->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.tools.show', $tool))->assertForbidden();
        $this->patchJson(route('api.admin.tools.update', $tool), [])->assertForbidden();
    }
}
