<?php

namespace Tests\Feature\Questions;

use App\Models\Chapter;
use App\Models\Post;
use App\Models\Question;
use App\Models\Quizz;
use App\Models\Theme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QuestionWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_redirects_to_quizz_edit_when_host_is_a_quizz(): void
    {
        $quizz = Quizz::factory()->create();
        $question = Question::factory()->forQuestionable($quizz)->create();

        $this->get(route('questions.show', $question))
            ->assertRedirect(route('admin.quizzes.edit', $quizz->id));
    }

    public function test_show_redirects_to_post_anchor_when_host_is_a_post(): void
    {
        $theme = Theme::factory()->create();
        $chapter = Chapter::factory()->create(['theme_id' => $theme->id]);
        $post = Post::create(['chapter_id' => $chapter->id, 'title' => 'Un post', 'order' => 1]);
        $question = Question::factory()->forQuestionable($post)->create();

        $this->get(route('questions.show', $question))
            ->assertRedirect(route('themes.chapters.posts.anchor', [
                'theme'   => $theme->slug,
                'chapter' => $chapter->slug,
                'order'   => $post->order,
                'type'    => 'question',
                'id'      => $question->id,
            ]));
    }

    public function test_edit_is_forbidden_for_guests(): void
    {
        $question = Question::factory()->withBlock()->create();

        // Groupe admin = auth:sanctum + verified + can:admin ; invité non authentifié.
        $this->get(route('admin.questions.edit', $question))
            ->assertStatus(302);
    }

    public function test_edit_is_forbidden_for_non_admins(): void
    {
        $this->actingAsUser();
        $question = Question::factory()->withBlock()->create();

        $this->get(route('admin.questions.edit', $question))
            ->assertForbidden();
    }

    public function test_admin_can_reach_edit_page(): void
    {
        $this->actingAsAdmin();
        $question = Question::factory()->withBlock()->create();

        $this->get(route('admin.questions.edit', $question))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Questions/QuestionEdit')
                ->where('question.id', $question->id)
            );
    }
}