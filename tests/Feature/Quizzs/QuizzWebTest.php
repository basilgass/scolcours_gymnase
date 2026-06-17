<?php

namespace Tests\Feature\Quizzs;

use App\Models\Chapter;
use App\Models\Question;
use App\Models\Quizz;
use App\Models\Theme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QuizzWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_renders_the_admin_list_for_an_admin(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->withBlocks()->create();
        Question::factory()->forQuestionable($quizz)->create();

        $this->get(route('admin.quizzes.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Quizzs/admin/AdminQuizz')
                ->has('quizzs', 1)
                ->where('quizzs.0.id', $quizz->id)
                ->where('quizzs.0.questions_count', 1)
                // intro/outro sont les deux premiers blocks (cf. store).
                ->where('quizzs.0.intro.title', 'intro')
                ->where('quizzs.0.outro.title', 'outro')
            );
    }

    public function test_index_does_not_crash_on_a_quizz_without_blocks(): void
    {
        $this->actingAsAdmin();
        // Quizz sans block : exerce la branche défensive de QuizzResource
        // (bug #1 du lot, intro/outro accédés par index → 500 avant correction).
        $quizz = Quizz::factory()->create();
        $this->assertSame(0, $quizz->blocks()->count());

        $this->get(route('admin.quizzes.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->where('quizzs.0.intro', null)
                ->where('quizzs.0.outro', null)
            );
    }

    public function test_index_is_redirected_for_guests(): void
    {
        $this->get(route('admin.quizzes.index'))->assertStatus(302);
    }

    public function test_index_is_forbidden_for_non_admins(): void
    {
        $this->actingAsUser();

        $this->get(route('admin.quizzes.index'))->assertForbidden();
    }

    public function test_admin_can_reach_edit_page_without_chapter(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();

        $this->get(route('admin.quizzes.edit', $quizz))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Quizzs/QuizzEdit')
                ->where('quizz.id', $quizz->id)
                // Sans chapitre, la prop theme vaut null (non renseignée).
                ->where('theme', null)
            );
    }

    public function test_edit_exposes_theme_when_quizz_has_a_chapter(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();
        $chapter = Chapter::factory()->create(['theme_id' => $theme->id]);
        $quizz = Quizz::factory()->create(['chapter_id' => $chapter->id]);

        $this->get(route('admin.quizzes.edit', $quizz))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Quizzs/QuizzEdit')
                ->where('quizz.id', $quizz->id)
                ->where('theme.id', $theme->id)
            );
    }

    public function test_edit_is_redirected_for_guests(): void
    {
        $quizz = Quizz::factory()->create();

        $this->get(route('admin.quizzes.edit', $quizz))->assertStatus(302);
    }

    public function test_edit_is_forbidden_for_non_admins(): void
    {
        $this->actingAsUser();
        $quizz = Quizz::factory()->create();

        $this->get(route('admin.quizzes.edit', $quizz))->assertForbidden();
    }
}
