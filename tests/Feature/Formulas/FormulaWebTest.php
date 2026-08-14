<?php

namespace Tests\Feature\Formulas;

use App\Models\Formula;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FormulaWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_open_the_formula_index(): void
    {
        $this->get(route('formulas.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Formulas/FormulaIndex'));
    }

    public function test_show_redirects_permanently_to_the_canonical_chapter_url(): void
    {
        $formula = Formula::factory()->create();
        $chapter = $formula->chapters()->first();

        // Redirection directe (301) vers l'URL canonique du chapitre, sans
        // passer par le raccourci chapters.show (évite la double redirection).
        $this->get(route('formulas.show', $formula))
            ->assertStatus(301)
            ->assertRedirect(route('themes.chapters.show', [
                $chapter->theme,
                $chapter,
            ]));
    }

    public function test_show_falls_back_to_the_index_for_an_orphan_formula(): void
    {
        $formula = Formula::factory()->create();
        $formula->chapters()->detach();

        $this->get(route('formulas.show', $formula))
            ->assertRedirect(route('formulas.index'));
    }
}
