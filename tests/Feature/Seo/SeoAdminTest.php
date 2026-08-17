<?php

namespace Tests\Feature\Seo;

use App\Models\Chapter;
use App\Models\Theme;
use App\Models\Tool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SeoAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_open_the_seo_audit(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create(['enabled' => true]);
        Chapter::factory()->create(['theme_id' => $theme->id, 'active' => true]);
        Tool::factory()->create();

        $this->get(route('admin.seo.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/AdminSeo')
                ->has('rows', fn (Assert $rows) => $rows->each(fn (Assert $row) => $row
                    ->has('url')
                    ->has('title')
                    ->has('description')
                    ->has('type')
                    ->has('metable_id')
                    ->has('override_title')
                    ->has('override_description')
                    ->has('source')
                    ->has('length')
                    ->etc()))
                ->etc());
    }

    public function test_admin_can_store_an_override(): void
    {
        $this->actingAsAdmin();
        $tool = Tool::factory()->create(['title' => 'Grapheur', 'body' => 'Body dérivé.']);

        $this->patchJson(route('admin.seo.update'), [
            'type'             => 'Tool',
            'id'               => $tool->id,
            'meta_title'       => 'Titre choisi',
            'meta_description' => 'Description choisie.',
        ])
            ->assertStatus(200)
            ->assertJson([
                'title'       => 'Titre choisi — Outil | Scolcours',
                'description' => 'Description choisie.',
                'source'      => 'override',
            ]);

        $this->assertDatabaseHas('metas', [
            'metable_type'     => Tool::class,
            'metable_id'       => $tool->id,
            'meta_description' => 'Description choisie.',
        ]);
    }

    public function test_clearing_both_fields_deletes_the_override(): void
    {
        $this->actingAsAdmin();
        $tool = Tool::factory()->create(['title' => 'Grapheur', 'body' => 'Tracer des fonctions.']);
        $tool->meta()->create(['meta_title' => 'x', 'meta_description' => 'y']);

        $this->patchJson(route('admin.seo.update'), [
            'type'             => 'Tool',
            'id'               => $tool->id,
            'meta_title'       => '',
            'meta_description' => '',
        ])
            ->assertStatus(200)
            ->assertJson([
                'description' => 'Tracer des fonctions.',
                'source'      => 'body',
            ]);

        $this->assertDatabaseMissing('metas', [
            'metable_type' => Tool::class,
            'metable_id'   => $tool->id,
        ]);
    }

    public function test_update_rejects_a_non_editable_type(): void
    {
        $this->actingAsAdmin();

        $this->patchJson(route('admin.seo.update'), [
            'type'             => 'static',
            'id'               => 1,
            'meta_description' => 'x',
        ])->assertStatus(422);
    }

    public function test_update_requires_admin(): void
    {
        $tool = Tool::factory()->create();

        $this->actingAsUser();
        $this->patchJson(route('admin.seo.update'), [
            'type' => 'Tool',
            'id'   => $tool->id,
        ])->assertForbidden();
    }

    public function test_seo_audit_requires_admin(): void
    {
        // Invité : redirigé vers le login.
        $this->get(route('admin.seo.index'))->assertStatus(302);

        // Authentifié non-admin : interdit.
        $this->actingAsUser();
        $this->get(route('admin.seo.index'))->assertForbidden();
    }
}
