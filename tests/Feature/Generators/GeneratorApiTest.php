<?php

namespace Tests\Feature\Generators;

use App\Models\Generator;
use App\Models\Theme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GeneratorApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_generators(): void
    {
        Generator::factory()->create(['title' => 'Alpha generateur']);
        Generator::factory()->create(['title' => 'Beta generateur']);

        $this->getJson(route('api.generators.index'))
            ->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonFragment(['title' => 'Alpha generateur']);
    }

    public function test_index_filters_by_search(): void
    {
        Generator::factory()->create(['title' => 'Trigonometrie de base']);
        Generator::factory()->create(['title' => 'Algebre lineaire']);

        $this->getJson(route('api.generators.index', ['search' => 'Trigo']))
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'Trigonometrie de base']);
    }

    public function test_show_returns_a_single_generator(): void
    {
        $generator = Generator::factory()->create(['title' => 'Mon generateur']);

        $this->getJson(route('api.generators.show', $generator))
            ->assertStatus(200)
            ->assertJsonPath('id', $generator->id)
            ->assertJsonPath('title', 'Mon generateur');
    }

    public function test_admin_can_store_a_generator_and_gets_the_raw_id_back(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();

        // store renvoie $generator->id (scalaire brut) → 200, corps = l'id.
        $response = $this->postJson(route('api.admin.generators.store'), [
            'theme_id' => $theme->id,
            'title'    => 'Nouveau generateur',
            'slug'     => 'nouveau-generateur',
        ])->assertStatus(200);

        $this->assertDatabaseHas('generators', ['slug' => 'nouveau-generateur']);
        $response->assertSee((string) Generator::first()->id, false);
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.generators.store'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['theme_id', 'title', 'slug']);
    }

    public function test_admin_can_update_a_generator(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();
        $generator = Generator::factory()->create(['theme_id' => $theme->id]);

        // UpdateGeneratorRequest impose tous les champs requis (pas de defaults).
        $this->patchJson(route('api.admin.generators.update', $generator), [
            'theme_id' => $theme->id,
            'title'    => 'Titre modifie',
            'slug'     => 'titre-modifie',
            'code'     => 'return {}',
            'template' => '\[a=b\]',
            'keyboard' => 'algebra',
        ])->assertStatus(200)
          ->assertJsonPath('title', 'Titre modifie');

        $this->assertSame('Titre modifie', $generator->fresh()->title);
    }

    public function test_update_validates_required_fields(): void
    {
        $this->actingAsAdmin();
        $generator = Generator::factory()->create();

        $this->patchJson(route('api.admin.generators.update', $generator), [
            'title' => '',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['theme_id', 'title', 'slug', 'code', 'template', 'keyboard']);
    }

    public function test_admin_can_destroy_a_generator(): void
    {
        $this->actingAsAdmin();
        $generator = Generator::factory()->create();

        $this->deleteJson(route('api.admin.generators.destroy', $generator))
            ->assertStatus(200);

        $this->assertModelMissing($generator);
    }

    public function test_generator_write_endpoints_require_admin(): void
    {
        $generator = Generator::factory()->create();

        $this->postJson(route('api.admin.generators.store'), [])->assertStatus(401);
        $this->patchJson(route('api.admin.generators.update', $generator), [])->assertStatus(401);
        $this->deleteJson(route('api.admin.generators.destroy', $generator))->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.generators.store'), [])->assertForbidden();
        $this->patchJson(route('api.admin.generators.update', $generator), [])->assertForbidden();
        $this->deleteJson(route('api.admin.generators.destroy', $generator))->assertForbidden();
    }
}
