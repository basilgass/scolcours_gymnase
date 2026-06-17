<?php

namespace Tests\Feature\Quizzs;

use App\Models\Question;
use App\Models\Quizz;
use App\Models\QuizzSession;
use App\Models\Score;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class QuizzSessionWebTest extends TestCase
{
    use RefreshDatabase;

    // --- index (élève) ---------------------------------------------------

    public function test_index_lists_only_enabled_sessions_of_the_user(): void
    {
        $user = $this->actingAsUser();
        $enabled = QuizzSession::factory()->enabled()->withUser($user)->create();
        $disabled = QuizzSession::factory()->withUser($user)->create(['enable' => false]);

        $this->get(route('students.quizzes.sessions.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Quizzs/QuizzIndex')
                ->has('quizzSessions', 1)
                ->where('quizzSessions.0.id', $enabled->id)
            );
    }

    public function test_index_is_redirected_for_guests(): void
    {
        // Groupe students = auth:sanctum + verified ; invité redirigé.
        $this->get(route('students.quizzes.sessions.index'))->assertStatus(302);
    }

    // --- show (élève) ----------------------------------------------------

    public function test_show_renders_the_session_with_a_null_question_at_intro(): void
    {
        $user = $this->actingAsUser();
        $session = QuizzSession::factory()->withUser($user)->create(['index' => 0]);

        $this->get(route('students.quizzes.sessions.show', $session))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Quizzs/QuizzShow')
                ->where('quizzSession.id', $session->id)
                // index 0 = intro : pas de question courante.
                ->where('question', null)
            );
    }

    public function test_show_exposes_the_current_question_when_index_in_range(): void
    {
        $user = $this->actingAsUser();
        $quizz = Quizz::factory()->create();
        $question = Question::factory()->forQuestionable($quizz)->create(['order' => 1]);
        $session = QuizzSession::factory()->forQuizz($quizz)->atIndex(1)->withUser($user)->create();

        $this->get(route('students.quizzes.sessions.show', $session))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Quizzs/QuizzShow')
                ->where('question.id', $question->id)
            );
    }

    public function test_show_is_redirected_for_guests(): void
    {
        $session = QuizzSession::factory()->create();

        $this->get(route('students.quizzes.sessions.show', $session))->assertStatus(302);
    }

    // --- dashboard (admin) -----------------------------------------------

    public function test_dashboard_renders_for_an_admin(): void
    {
        $this->actingAsAdmin();
        $session = QuizzSession::factory()->create();

        $this->get(route('admin.quizzes.sessions.dashboard', $session))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Quizzs/QuizzDashboard')
                ->where('quizzSession.id', $session->id)
            );
    }

    public function test_dashboard_is_forbidden_for_non_admins(): void
    {
        $session = QuizzSession::factory()->create();

        $this->get(route('admin.quizzes.sessions.dashboard', $session))->assertStatus(302);

        $this->actingAsUser();
        $this->get(route('admin.quizzes.sessions.dashboard', $session))->assertForbidden();
    }

    // --- projection (admin) ----------------------------------------------

    public function test_projection_returns_no_scores_at_intro(): void
    {
        $this->actingAsAdmin();
        $session = QuizzSession::factory()->create(['index' => 0]);

        $this->get(route('admin.quizzes.sessions.projection', $session))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Quizzs/QuizzProjection')
                ->has('scores', 0)
                ->where('usersCount', 0)
            );
    }

    public function test_projection_returns_scores_of_session_users_for_the_current_question(): void
    {
        $this->actingAsAdmin();
        $player = \App\Models\User::factory()->create();
        $quizz = Quizz::factory()->create();
        $question = Question::factory()->forQuestionable($quizz)->create(['order' => 1]);
        $session = QuizzSession::factory()->forQuizz($quizz)->atIndex(1)->withUser($player)->create();

        // Score du joueur sur la question courante (doit apparaître).
        Score::factory()->forScoreable($question)->forUser($player)->create();
        // Score d'un autre utilisateur non inscrit à la session (doit être filtré).
        Score::factory()->forScoreable($question)->create();

        $this->get(route('admin.quizzes.sessions.projection', $session))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Quizzs/QuizzProjection')
                ->has('scores', 1)
                ->where('scores.0.user_id', $player->id)
                ->where('usersCount', 1)
            );
    }

    public function test_projection_is_forbidden_for_non_admins(): void
    {
        $session = QuizzSession::factory()->create();

        $this->get(route('admin.quizzes.sessions.projection', $session))->assertStatus(302);

        $this->actingAsUser();
        $this->get(route('admin.quizzes.sessions.projection', $session))->assertForbidden();
    }
}
