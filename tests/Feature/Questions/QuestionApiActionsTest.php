<?php

namespace Tests\Feature\Questions;

use App\Models\Question;
use App\Models\Quizz;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionApiActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_duplicate_a_question_with_its_block(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();
        $question = Question::factory()->withBlock()->forQuestionable($quizz)->create(['order' => 1]);

        $response = $this->postJson(route('api.admin.questions.duplicate', $question))
            ->assertStatus(201);

        $newId = $response->json('id');
        $this->assertNotSame($question->id, $newId);
        $this->assertSame(2, Question::count());
        // Le block est dupliqué avec la nouvelle question.
        $this->assertSame(1, Question::find($newId)->blocks()->count());
    }

    public function test_duplicate_requires_admin(): void
    {
        $question = Question::factory()->withBlock()->create();

        $this->postJson(route('api.admin.questions.duplicate', $question))->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.questions.duplicate', $question))->assertForbidden();

        $this->assertSame(1, Question::count());
    }

    public function test_admin_can_reorder_questions_of_a_host(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();
        $q1 = Question::factory()->forQuestionable($quizz)->create(['order' => 1]);
        $q2 = Question::factory()->forQuestionable($quizz)->create(['order' => 2]);

        $this->patchJson(route('api.admin.questions.order', ['type' => 'quizz', 'id' => $quizz->id]), [
            'order' => [
                ['id' => $q1->id, 'order' => 2],
                ['id' => $q2->id, 'order' => 1],
            ],
        ])->assertStatus(200);

        $this->assertSame(2, $q1->fresh()->order);
        $this->assertSame(1, $q2->fresh()->order);
    }

    public function test_reorder_aborts_on_unknown_host_type(): void
    {
        $this->actingAsAdmin();

        $this->patchJson(route('api.admin.questions.order', ['type' => 'banana', 'id' => 1]), [
            'order' => [],
        ])->assertStatus(404);
    }

    public function test_admin_can_set_display_if_on_a_single_question(): void
    {
        $this->actingAsAdmin();
        $question = Question::factory()->withBlock()->create();

        $this->patchJson(route('api.admin.questions.displayIf', $question), [
            'displayIf' => '5',
        ])->assertStatus(200);

        $this->assertSame('5', $question->fresh()->display_if);
    }

    public function test_admin_can_batch_update_display_if(): void
    {
        $this->actingAsAdmin();
        $q1 = Question::factory()->withBlock()->create();
        $q2 = Question::factory()->withBlock()->create();

        $this->patchJson(route('api.admin.questions.batch.displayIf'), [
            'updates' => [
                ['id' => $q1->id, 'display_if' => 2],
                ['id' => $q2->id, 'display_if' => null],
            ],
        ])->assertStatus(200);

        $this->assertEquals(2, $q1->fresh()->display_if);
        $this->assertNull($q2->fresh()->display_if);
    }

    public function test_batch_update_display_if_validates_payload(): void
    {
        $this->actingAsAdmin();

        // updates est requis ; id inexistant rejeté par la règle exists.
        $this->patchJson(route('api.admin.questions.batch.displayIf'), [
            'updates' => [
                ['id' => 999999, 'display_if' => 1],
            ],
        ])->assertStatus(422)->assertJsonValidationErrors(['updates.0.id']);
    }

    public function test_admin_can_move_a_question_to_another_host(): void
    {
        $this->actingAsAdmin();
        $source = Quizz::factory()->create();
        $destination = Quizz::factory()->create();
        $question = Question::factory()->withBlock()->forQuestionable($source)->create(['order' => 1]);

        $response = $this->patchJson(route('api.admin.questions.move', $question), [
            'target_type' => 'quizz',
            'target_id'   => $destination->id,
        ])->assertStatus(200)
            ->assertJsonPath('label', $destination->title);

        $question->refresh();
        $this->assertSame($destination->id, $question->questionable_id);
        $this->assertSame(Quizz::class, $question->questionable_type);
        // Première question du nouvel hôte : ordre = max(0) + 1.
        $this->assertSame(1, $question->order);
    }

    public function test_move_requires_admin(): void
    {
        $destination = Quizz::factory()->create();
        $question = Question::factory()->withBlock()->create();
        $payload = ['target_type' => 'quizz', 'target_id' => $destination->id];

        $this->patchJson(route('api.admin.questions.move', $question), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.questions.move', $question), $payload)
            ->assertForbidden();
    }
}
