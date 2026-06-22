<?php

namespace Tests\Feature\Tools;

use App\Models\Tool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ToolWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_is_public(): void
    {
        Tool::factory()->count(2)->create();

        $this->get(route('tools.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tools/ToolIndex')
                ->has('tools', 2));
    }

    public function test_show_by_slug_is_public(): void
    {
        $tool = Tool::factory()->create(['slug' => 'mon-outil']);

        $this->get(route('tools.show', 'mon-outil'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tools/ToolShow')
                ->where('tool.id', $tool->id));
    }

    public function test_show_by_id_redirects_permanently_to_the_canonical_slug(): void
    {
        // Accédé par id, tools.show redirige en 301 vers l'URL canonique du slug
        // (correctif de la boucle : redirect()->route('tools.show', $tool->slug, 301)).
        $tool = Tool::factory()->create(['slug' => 'canonique']);

        $this->get(route('tools.show', $tool->id))
            ->assertStatus(301)
            ->assertRedirect(route('tools.show', $tool->slug));

        // Et l'URL canonique répond bien en 200 (pas de boucle).
        $this->get(route('tools.show', $tool->slug))->assertStatus(200);
    }

    public function test_edit_is_restricted_to_admins(): void
    {
        $tool = Tool::factory()->create();

        $this->get(route('admin.tools.edit', $tool))->assertRedirect();

        $this->actingAsUser();
        $this->get(route('admin.tools.edit', $tool))->assertForbidden();
    }

    public function test_admin_can_open_the_edit_page(): void
    {
        $this->actingAsAdmin();
        $tool = Tool::factory()->create();

        $this->get(route('admin.tools.edit', $tool))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tools/ToolEdit')
                ->where('tool.id', $tool->id));
    }
}
