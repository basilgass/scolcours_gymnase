<?php

namespace Tests\Feature\Quizzs;

use App\Models\QuizzSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizzApiActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_update_current_sets_index_and_resets_show_answer(): void
    {
        $this->actingAsAdmin();
        $session = QuizzSession::factory()->create(['index' => 0, 'show_answer' => true]);

        $this->patchJson(route('api.admin.quizzes.sessions.current', $session), [
            'index' => 3,
        ])
            ->assertStatus(200)
            ->assertJsonPath('current', 3)
            ->assertJsonPath('showAnswer', false);

        $session->refresh();
        $this->assertSame(3, $session->index);
        $this->assertFalse($session->show_answer);
    }

    public function test_update_current_rejects_a_negative_index(): void
    {
        $this->actingAsAdmin();
        $session = QuizzSession::factory()->create(['index' => 1]);

        $this->patchJson(route('api.admin.quizzes.sessions.current', $session), [
            'index' => -1,
        ])->assertStatus(422)->assertJsonValidationErrors(['index']);
    }

    public function test_update_current_requires_admin(): void
    {
        $session = QuizzSession::factory()->create();

        $this->patchJson(route('api.admin.quizzes.sessions.current', $session), ['index' => 1])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.quizzes.sessions.current', $session), ['index' => 1])
            ->assertForbidden();
    }

    public function test_update_show_answer_toggles_the_flag(): void
    {
        $this->actingAsAdmin();
        $session = QuizzSession::factory()->create(['show_answer' => false]);

        $this->patchJson(route('api.admin.quizzes.sessions.answer', $session))
            ->assertStatus(200)
            ->assertJsonPath('showAnswer', true);

        $this->assertTrue($session->fresh()->show_answer);

        // Un second appel rebascule à false.
        $this->patchJson(route('api.admin.quizzes.sessions.answer', $session))
            ->assertStatus(200)
            ->assertJsonPath('showAnswer', false);
    }

    public function test_update_show_answer_requires_admin(): void
    {
        $session = QuizzSession::factory()->create(['show_answer' => false]);

        $this->patchJson(route('api.admin.quizzes.sessions.answer', $session))
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.quizzes.sessions.answer', $session))
            ->assertForbidden();
    }

    public function test_update_enable_sets_the_flag_and_returns_no_content(): void
    {
        $this->actingAsAdmin();
        $session = QuizzSession::factory()->create(['enable' => false]);

        $this->patchJson(route('api.admin.quizzes.sessions.enable', $session), [
            'enable' => true,
        ])->assertNoContent();

        $this->assertTrue($session->fresh()->enable);
    }

    public function test_update_enable_requires_admin(): void
    {
        $session = QuizzSession::factory()->create(['enable' => false]);

        $this->patchJson(route('api.admin.quizzes.sessions.enable', $session), ['enable' => true])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.quizzes.sessions.enable', $session), ['enable' => true])
            ->assertForbidden();

        $this->assertFalse($session->fresh()->enable);
    }
}
