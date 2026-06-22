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

    public function test_show_redirects_to_the_chapter(): void
    {
        $formula = Formula::factory()->create();

        $this->get(route('formulas.show', $formula))
            ->assertRedirect(route('chapters.show', $formula->chapter));
    }
}
