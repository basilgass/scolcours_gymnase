<?php

namespace Tests\Feature\Evaluations;

use App\Models\Evaluation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvaluationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_an_evaluation_with_empty_body(): void
    {
        $this->actingAsAdmin();

        $response = $this->postJson(route('api.admin.evaluations.store'), [
            'slug'  => 'mon-eval',
            'title' => 'Mon évaluation',
        ]);

        // store renvoie une Resource depuis un POST → 201.
        $response->assertStatus(201)
            ->assertJsonPath('slug', 'mon-eval')
            ->assertJsonPath('title', 'Mon évaluation')
            ->assertJsonPath('body', '');

        $this->assertSame(1, Evaluation::where('slug', 'mon-eval')->count());
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.evaluations.store'), [])
            ->assertStatus(422)->assertJsonValidationErrors(['slug', 'title']);
    }

    public function test_store_rejects_a_duplicate_slug(): void
    {
        $this->actingAsAdmin();
        Evaluation::factory()->create(['slug' => 'deja-pris']);

        $this->postJson(route('api.admin.evaluations.store'), [
            'slug'  => 'deja-pris',
            'title' => 'Doublon',
        ])->assertStatus(422)->assertJsonValidationErrors(['slug']);
    }

    public function test_store_requires_admin(): void
    {
        $payload = ['slug' => 'x', 'title' => 'X'];

        $this->postJson(route('api.admin.evaluations.store'), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.evaluations.store'), $payload)->assertForbidden();

        $this->assertSame(0, Evaluation::count());
    }

    public function test_update_persists_and_returns_no_content(): void
    {
        $this->actingAsAdmin();
        $evaluation = Evaluation::factory()->create([
            'title'        => 'ancien',
            'body'         => 'ancien corps',
            'auto_control' => false,
        ]);

        $this->patchJson(route('api.admin.evaluations.update', $evaluation), [
            'title'        => 'nouveau',
            'body'         => 'nouveau corps',
            'auto_control' => true,
        ])->assertNoContent();

        $evaluation->refresh();
        $this->assertSame('nouveau', $evaluation->title);
        $this->assertSame('nouveau corps', $evaluation->body);
        $this->assertTrue($evaluation->auto_control);
    }

    public function test_update_keeps_its_own_slug_unique_constraint(): void
    {
        $this->actingAsAdmin();
        $evaluation = Evaluation::factory()->create(['slug' => 'le-mien']);

        // Renvoyer son propre slug est autorisé (ignore self).
        $this->patchJson(route('api.admin.evaluations.update', $evaluation), [
            'title'        => 'titre',
            'body'         => 'corps',
            'auto_control' => false,
            'slug'         => 'le-mien',
        ])->assertNoContent();
    }

    public function test_update_rejects_a_slug_used_by_another_evaluation(): void
    {
        $this->actingAsAdmin();
        Evaluation::factory()->create(['slug' => 'autre']);
        $evaluation = Evaluation::factory()->create(['slug' => 'le-mien']);

        $this->patchJson(route('api.admin.evaluations.update', $evaluation), [
            'title'        => 'titre',
            'body'         => 'corps',
            'auto_control' => false,
            'slug'         => 'autre',
        ])->assertStatus(422)->assertJsonValidationErrors(['slug']);
    }

    public function test_update_validates_required_fields(): void
    {
        $this->actingAsAdmin();
        $evaluation = Evaluation::factory()->create();

        $this->patchJson(route('api.admin.evaluations.update', $evaluation), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'body', 'auto_control']);
    }

    public function test_update_requires_admin(): void
    {
        $evaluation = Evaluation::factory()->create(['title' => 'intact']);
        $payload = ['title' => 'piraté', 'body' => 'x', 'auto_control' => true];

        $this->patchJson(route('api.admin.evaluations.update', $evaluation), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.evaluations.update', $evaluation), $payload)
            ->assertForbidden();

        $this->assertSame('intact', $evaluation->fresh()->title);
    }

    public function test_index_show_and_destroy_are_empty_no_ops(): void
    {
        // Méthodes routées (apiResource) mais à corps vide (dette B4 : code mort
        // partiel). On fige le comportement : 200 sans contenu, destroy ne supprime pas.
        $this->actingAsAdmin();
        $evaluation = Evaluation::factory()->create();

        $this->getJson(route('api.admin.evaluations.index'))->assertStatus(200);
        $this->getJson(route('api.admin.evaluations.show', $evaluation))->assertStatus(200);
        $this->deleteJson(route('api.admin.evaluations.destroy', $evaluation))->assertStatus(200);

        $this->assertModelExists($evaluation);
    }

    public function test_index_requires_admin(): void
    {
        $this->getJson(route('api.admin.evaluations.index'))->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.evaluations.index'))->assertForbidden();
    }
}
