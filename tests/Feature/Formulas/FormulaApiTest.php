<?php

namespace Tests\Feature\Formulas;

use App\Models\Chapter;
use App\Models\Formula;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FormulaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_all_formulas(): void
    {
        Formula::factory()->count(2)->create();

        $this->getJson(route('api.formulas.index'))
            ->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonStructure([['id', 'theme_id', 'chapter', 'order', 'block']]);
    }

    public function test_index_filters_by_chapter_id(): void
    {
        $chapter = Chapter::factory()->create();
        Formula::factory()->create(['chapter_id' => $chapter->id]);
        Formula::factory()->create(); // autre chapitre

        $this->getJson(route('api.formulas.index', ['chapter_id' => $chapter->id]))
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.chapter.id', $chapter->id);
    }

    public function test_index_filters_by_ids_in_the_requested_order(): void
    {
        $f1 = Formula::factory()->create();
        $f2 = Formula::factory()->create();
        $f3 = Formula::factory()->create();

        // Ordre demandé : f3, f1, f2 → doit être respecté (tri PHP portable).
        $this->getJson(route('api.formulas.index', ['ids' => [$f3->id, $f1->id, $f2->id]]))
            ->assertStatus(200)
            ->assertJsonCount(3)
            ->assertJsonPath('0.id', $f3->id)
            ->assertJsonPath('1.id', $f1->id)
            ->assertJsonPath('2.id', $f2->id);
    }

    public function test_show_returns_a_single_formula(): void
    {
        $formula = Formula::factory()->create();

        $this->getJson(route('api.formulas.show', $formula))
            ->assertStatus(200)
            ->assertJsonPath('id', $formula->id);
    }

    public function test_admin_can_store_a_formula_with_a_block(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();
        Formula::factory()->create(['chapter_id' => $chapter->id]); // ordre existant

        // store renvoie une Resource d'un modèle fraichement créé → 201.
        $this->postJson(route('api.admin.chapters.formulas.store', $chapter))
            ->assertStatus(201)
            ->assertJsonPath('chapter.id', $chapter->id)
            ->assertJsonPath('order', 2)
            ->assertJsonPath('block.body', 'A modifier...');

        $this->assertSame(2, $chapter->formulas()->count());
    }

    public function test_admin_can_destroy_a_formula(): void
    {
        $this->actingAsAdmin();
        $formula = Formula::factory()->create();

        $this->deleteJson(route('api.admin.formulas.destroy', $formula))
            ->assertStatus(200);

        $this->assertModelMissing($formula);
    }

    public function test_admin_can_reorder_formulas(): void
    {
        $this->actingAsAdmin();
        $f1 = Formula::factory()->create(['order' => 1]);
        $f2 = Formula::factory()->create(['order' => 2]);

        $this->postJson(route('api.admin.formulas.order'), [
            'order' => [
                ['id' => $f1->id, 'order' => 5],
                ['id' => $f2->id, 'order' => 6],
            ],
        ])->assertStatus(204);

        $this->assertSame(5, $f1->fresh()->order);
        $this->assertSame(6, $f2->fresh()->order);
    }

    public function test_admin_can_duplicate_a_formula(): void
    {
        $this->actingAsAdmin();
        $formula = Formula::factory()->create();

        $this->postJson(route('api.admin.formulas.duplicate', $formula))
            ->assertStatus(201)
            ->assertJsonPath('chapter.id', $formula->chapter_id)
            ->assertJsonPath('block.body', 'A modifier...');

        $this->assertSame(2, Formula::count());
    }

    public function test_admin_can_move_a_formula_to_another_chapter(): void
    {
        $this->actingAsAdmin();
        $formula = Formula::factory()->create();
        $target = Chapter::factory()->create(['title' => 'Chapitre cible']);

        $this->patchJson(route('api.admin.formulas.move', $formula), [
            'target_id'   => $target->id,
            'target_type' => 'chapter',
        ])->assertStatus(200)
          ->assertJsonPath('label', 'Chapitre cible');

        $this->assertSame($target->id, $formula->fresh()->chapter_id);
    }

    public function test_get_formulas_from_chapter_returns_the_expected_structure(): void
    {
        $chapter = Chapter::factory()->create();
        Formula::factory()->create(['chapter_id' => $chapter->id]);

        $this->getJson(route('api.chapters.formulas.index', $chapter))
            ->assertStatus(200)
            ->assertJsonStructure(['formular', 'chapters'])
            ->assertJsonCount(1, 'formular');
    }

    public function test_formula_write_endpoints_require_admin(): void
    {
        $chapter = Chapter::factory()->create();
        $formula = Formula::factory()->create();

        $this->postJson(route('api.admin.chapters.formulas.store', $chapter))->assertStatus(401);
        $this->deleteJson(route('api.admin.formulas.destroy', $formula))->assertStatus(401);
        $this->postJson(route('api.admin.formulas.order'), [])->assertStatus(401);
        $this->postJson(route('api.admin.formulas.duplicate', $formula))->assertStatus(401);
        $this->patchJson(route('api.admin.formulas.move', $formula), [])->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.chapters.formulas.store', $chapter))->assertForbidden();
        $this->deleteJson(route('api.admin.formulas.destroy', $formula))->assertForbidden();
        $this->postJson(route('api.admin.formulas.order'), [])->assertForbidden();
        $this->postJson(route('api.admin.formulas.duplicate', $formula))->assertForbidden();
        $this->patchJson(route('api.admin.formulas.move', $formula), [])->assertForbidden();
    }
}
