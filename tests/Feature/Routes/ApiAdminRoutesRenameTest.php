<?php

namespace Tests\Feature\Routes;

use Tests\TestCase;

class ApiAdminRoutesRenameTest extends TestCase
{
    // Toutes les routes admin → middleware admin → requête non-authentifiée → 302

    public function test_api_admin_courses_teams_toggle_route_exists(): void
    {
        $this->patch(route('api.admin.courses.teams.toggle', ['course' => 1, 'team' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_courses_lessonables_index_route_exists(): void
    {
        $this->get(route('api.admin.courses.lessonables.index'))
            ->assertRedirect();
    }

    public function test_api_admin_courses_lessons_order_route_exists(): void
    {
        $this->patch(route('api.admin.courses.lessons.order', ['course' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_teams_lessons_calendars_update_route_exists(): void
    {
        $this->patch(route('api.admin.teams.lessons.calendars.update', ['team' => 1, 'lesson' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_evaluations_teams_toggle_route_exists(): void
    {
        $this->patch(route('api.admin.evaluations.teams.toggle', ['evaluation' => 1, 'team' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_teams_users_toggle_route_exists(): void
    {
        $this->patch(route('api.admin.teams.users.toggle', ['team' => 1, 'user' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_teams_users_index_route_exists(): void
    {
        $this->get(route('api.admin.teams.users.index', ['team' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_chapters_active_route_exists(): void
    {
        $this->patch(route('api.admin.chapters.active', ['chapter' => 'fake-slug']))
            ->assertRedirect();
    }

    public function test_api_admin_chapters_current_route_exists(): void
    {
        $this->post(route('api.admin.chapters.current', ['chapter' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_chapters_posts_order_route_exists(): void
    {
        $this->patch(route('api.admin.chapters.posts.order', ['chapter' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_challenges_generators_order_route_exists(): void
    {
        $this->patch(route('api.admin.challenges.generators.order', ['challenge' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_formulas_order_route_exists(): void
    {
        $this->post(route('api.admin.formulas.order'))
            ->assertRedirect();
    }

    public function test_api_admin_decks_chapter_route_exists(): void
    {
        $this->patch(route('api.admin.decks.chapter', ['deck' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_decks_active_route_exists(): void
    {
        $this->patch(route('api.admin.decks.active', ['deck' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_blocks_illustrations_grid_route_exists(): void
    {
        $this->patch(route('api.admin.blocks.illustrations.grid', ['block' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_illustrations_upload_route_exists(): void
    {
        $this->post(route('api.admin.illustrations.upload'))
            ->assertRedirect();
    }

    public function test_api_admin_posts_questions_grid_route_exists(): void
    {
        $this->patch(route('api.admin.posts.questions.grid', ['post' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_questions_order_route_exists(): void
    {
        $this->patch(route('api.admin.questions.order', ['type' => 'block', 'id' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_questions_display_if_route_exists(): void
    {
        $this->patch(route('api.admin.questions.displayIf', ['question' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_questions_batch_display_if_route_exists(): void
    {
        $this->patch(route('api.admin.questions.batch.displayIf'))
            ->assertRedirect();
    }

    public function test_api_admin_scores_bulk_route_exists(): void
    {
        $this->delete(route('api.admin.scores.bulk'))
            ->assertRedirect();
    }

    public function test_api_admin_quizzes_store_route_exists(): void
    {
        $this->post(route('api.admin.quizzes.store'))
            ->assertRedirect();
    }

    public function test_api_admin_quizzes_update_route_exists(): void
    {
        $this->patch(route('api.admin.quizzes.update', ['quizz' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_quizzes_destroy_route_exists(): void
    {
        $this->delete(route('api.admin.quizzes.destroy', ['quizz' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_quizzes_sessions_index_route_exists(): void
    {
        $this->get(route('api.admin.quizzes.sessions.index', ['quizz' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_quizzes_sessions_current_route_exists(): void
    {
        $this->patch(route('api.admin.quizzes.sessions.current', ['quizzSession' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_quizzes_sessions_answer_route_exists(): void
    {
        $this->patch(route('api.admin.quizzes.sessions.answer', ['quizzSession' => 1]))
            ->assertRedirect();
    }

    public function test_api_admin_quizzes_sessions_enable_route_exists(): void
    {
        $this->patch(route('api.admin.quizzes.sessions.enable', ['quizzSession' => 1]))
            ->assertRedirect();
    }
}
