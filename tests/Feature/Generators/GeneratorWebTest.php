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
