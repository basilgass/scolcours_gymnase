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

    public function test_index_hides_inactive_generators_for_non_admins(): void
    {
        Generator::factory()->create(['title' => 'Actif', 'active' => true]);
        Generator::factory()->create(['title' => 'Inactif', 'active' => false]);

        // Invité : ne voit que l'actif.
        $this->getJson(route('api.generators.index'))
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment(['title' => 'Actif'])
            ->assertJsonMissing(['title' => 'Inactif']);

        // Utilisateur non-admin : même filtrage.
        $this->actingAsUser();
        $this->getJson(route('api.generators.index'))
            ->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_index_shows_inactive_generators_to_admins(): void
    {
        $this->actingAsAdmin();
        Generator::factory()->create(['active' => true]);
        Generator::factory()->create(['active' => false]);

        $this->getJson(route('api.generators.index'))
            ->assertStatus(200)
            ->assertJsonCount(2);
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

    public function test_admin_can_duplicate_a_generator(): void
    {
        $this->actingAsAdmin();
        $generator = Generator::factory()->create([
            'title'  => 'Mon generateur',
            'slug'   => 'mon-generateur',
            'active' => true,
        ]);

        // 201 : la Resource enveloppe un modèle fraîchement créé (wasRecentlyCreated).
        $response = $this->postJson(route('api.admin.generators.duplicate', $generator))
            ->assertStatus(201)
            ->assertJsonPath('title', 'Mon generateur (copie)')
            ->assertJsonPath('active', false);

        $newId = $response->json('id');
        $this->assertNotSame($generator->id, $newId);

        $copy = Generator::findOrFail($newId);
        $this->assertSame('mon-generateur-copie', $copy->slug);
        $this->assertFalse($copy->active);

        // L'original reste intact.
        $this->assertTrue($generator->fresh()->active);
        $this->assertSame('Mon generateur', $generator->fresh()->title);
    }

    public function test_duplicate_generates_a_unique_slug_when_copy_slug_is_taken(): void
    {
        $this->actingAsAdmin();
        $generator = Generator::factory()->create(['slug' => 'gen']);
        // Le slug de copie « naturel » est déjà pris → la copie doit incrémenter.
        Generator::factory()->create(['slug' => 'gen-copie']);

        $response = $this->postJson(route('api.admin.generators.duplicate', $generator))
            ->assertStatus(201);

        $this->assertSame('gen-copie-2', Generator::findOrFail($response->json('id'))->slug);
    }

    public function test_duplicate_requires_admin(): void
    {
        $generator = Generator::factory()->create();

        $this->postJson(route('api.admin.generators.duplicate', $generator))->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.generators.duplicate', $generator))->assertForbidden();
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
