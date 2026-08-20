<?php

namespace Tests\Feature\Generators;

use App\Models\Generator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GeneratorWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_open_the_generator_index(): void
    {
        Generator::factory()->count(2)->create();

        $this->get(route('generators.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Generators/GeneratorIndex')
                ->has('generators', 2));
    }

    public function test_generator_index_hides_inactive_generators_for_non_admins(): void
    {
        Generator::factory()->create(['active' => true]);
        Generator::factory()->create(['active' => false]);

        // Invité : ne voit que l'actif.
        $this->get(route('generators.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page->has('generators', 1));

        // Utilisateur non-admin : même filtrage.
        $this->actingAsUser();
        $this->get(route('generators.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page->has('generators', 1));
    }

    public function test_generator_index_shows_inactive_generators_to_admins(): void
    {
        $this->actingAsAdmin();
        Generator::factory()->create(['active' => true]);
        Generator::factory()->create(['active' => false]);

        $this->get(route('generators.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page->has('generators', 2));
    }

    public function test_public_can_open_a_generator_by_slug(): void
    {
        $generator = Generator::factory()->create(['slug' => 'mon-generateur']);

        // La route est scopée sur le slug.
        $this->get(route('generators.show', $generator->slug))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Generators/GeneratorShow')
                ->where('generator.id', $generator->id));
    }

    public function test_admin_can_open_the_admin_generator_index(): void
    {
        $this->actingAsAdmin();
        Generator::factory()->count(3)->create();

        $this->get(route('admin.generators.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Generators/admin/AdminGenerator')
                ->has('generators', 3));
    }

    public function test_admin_generators_are_ordered_by_theme_then_slug(): void
    {
        $this->actingAsAdmin();

        // Ordre d'insertion mélangé ; titres volontairement désalignés du slug
        // pour prouver que le tri porte sur le slug et non sur le titre (piège de l'affichage mathématique).
        Generator::factory()->create(['theme_id' => 2, 'slug' => 'beta', 'title' => 'Mmm']);
        Generator::factory()->create(['theme_id' => 1, 'slug' => 'zeta', 'title' => 'Aaa']);
        Generator::factory()->create(['theme_id' => 1, 'slug' => 'alpha', 'title' => 'Zzz']);

        $this->get(route('admin.generators.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Generators/admin/AdminGenerator')
                ->has('generators', 3)
                // Thème 1 en premier, départagé par slug (alpha avant zeta) et non par titre (Zzz avant Aaa).
                ->where('generators.0.theme_id', 1)
                ->where('generators.0.slug', 'alpha')
                ->where('generators.1.theme_id', 1)
                ->where('generators.1.slug', 'zeta')
                // Thème 2 ensuite, malgré un slug (beta) alphabétiquement avant zeta.
                ->where('generators.2.theme_id', 2)
                ->where('generators.2.slug', 'beta'));
    }

    public function test_admin_can_open_the_generator_edit_page(): void
    {
        $this->actingAsAdmin();
        $generator = Generator::factory()->create();

        $this->get(route('admin.generators.edit', $generator))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Generators/GeneratorEdit')
                ->where('generator.id', $generator->id)
                ->has('challenges'));
    }

    public function test_edit_page_is_restricted_to_admins(): void
    {
        $generator = Generator::factory()->create();

        $this->get(route('admin.generators.edit', $generator))->assertRedirect();

        $this->actingAsUser();
        $this->get(route('admin.generators.edit', $generator))->assertForbidden();
    }
}
