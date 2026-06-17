<?php

namespace Tests\Feature\Questions;

use App\Models\Question;
use App\Models\Quizz;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuestionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_no_content_for_admin(): void
    {
        $this->actingAsAdmin();

        $this->getJson(route('api.admin.questions.index'))
            ->assertNoContent();
    }

    public function test_index_requires_admin(): void
    {
        $this->getJson(route('api.admin.questions.index'))->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.questions.index'))->assertForbidden();
    }

    public function test_show_returns_the_question_resource(): void
    {
        $this->actingAsAdmin();
        $question = Question::factory()->withBlock()->create();

        $this->getJson(route('api.admin.questions.show', $question))
            ->assertStatus(200)
            ->assertJsonPath('id', $question->id)
            ->assertJsonPath('block.body', 'sans contenu');
    }

    public function test_show_on_a_question_without_block_recreates_one(): void
    {
        $this->actingAsAdmin();
        // Question volontairement sans block : exerce la branche défensive du
        // QuestionResource (bug #1, corrigé dans ce lot).
        $question = Question::factory()->create();
        $this->assertSame(0, $question->blocks()->count());

        $this->getJson(route('api.admin.questions.show', $question))
            ->assertStatus(200);

        $this->assertSame(1, $question->fresh()->blocks()->count());
    }

    public function test_show_requires_admin(): void
    {
        $question = Question::factory()->withBlock()->create();

        $this->getJson(route('api.admin.questions.show', $question))->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.questions.show', $question))->assertForbidden();
    }

    public function test_admin_can_create_a_question_with_a_block_and_next_order(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();
        Question::factory()->forQuestionable($quizz)->create(['order' => 1]);

        $response = $this->postJson(route('api.admin.questions.store'), [
            'target_type' => 'quizz',
            'target_id'   => $quizz->id,
            'keyboard'    => 'standard',
            'answer'      => '42',
        ])->assertStatus(201);

        $created = Question::find($response->json('id'));
        $this->assertNotNull($created);
        $this->assertSame(2, $created->order);
        $this->assertSame($quizz->id, $created->questionable_id);
        $this->assertSame(1, $created->blocks()->count());
    }

    public function test_store_requires_admin(): void
    {
        $quizz = Quizz::factory()->create();
        $payload = [
            'target_type' => 'quizz',
            'target_id'   => $quizz->id,
            'keyboard'    => 'standard',
            'answer'      => '42',
        ];

        $this->postJson(route('api.admin.questions.store'), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.questions.store'), $payload)->assertForbidden();

        $this->assertSame(0, Question::count());
    }

    public function test_store_validates_required_question_fields(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();

        $this->postJson(route('api.admin.questions.store'), [
            'target_type' => 'quizz',
            'target_id'   => $quizz->id,
        ])->assertStatus(422)->assertJsonValidationErrors(['keyboard', 'answer']);
    }

    public function test_store_validates_target_fields(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.questions.store'), [
            'keyboard' => 'standard',
            'answer'   => '42',
        ])->assertStatus(422)->assertJsonValidationErrors(['target_id', 'target_type']);
    }

    public function test_store_rejects_an_unknown_target_type(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.questions.store'), [
            'target_type' => 'banana',
            'target_id'   => 1,
            'keyboard'    => 'standard',
            'answer'      => '42',
        ])->assertStatus(422);

        $this->assertSame(0, Question::count());
    }

    public function test_store_persists_display_if(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();

        $response = $this->postJson(route('api.admin.questions.store'), [
            'target_type' => 'quizz',
            'target_id'   => $quizz->id,
            'keyboard'    => 'standard',
            'answer'      => '42',
            'display_if'  => '3',
        ])->assertStatus(201);

        // display_if doit être enregistré (bug #2 : fillable obsolète, corrigé ici).
        $this->assertSame('3', Question::find($response->json('id'))->display_if);
    }

    public function test_update_persists_valid_attributes(): void
    {
        $this->actingAsAdmin();
        $question = Question::factory()->withBlock()->create([
            'keyboard' => 'standard',
            'answer'   => 'ancienne',
        ]);

        $this->patchJson(route('api.admin.questions.update', $question), [
            'keyboard' => 'scientific',
            'answer'   => 'nouvelle',
        ])->assertStatus(200);

        $question->refresh();
        $this->assertSame('scientific', $question->keyboard);
        $this->assertSame('nouvelle', $question->answer);
    }

    public function test_update_rejects_missing_required_fields(): void
    {
        $this->actingAsAdmin();
        $question = Question::factory()->withBlock()->create();

        // keyboard et answer sont requis par UpdateQuestionRequest.
        $this->patchJson(route('api.admin.questions.update', $question), [
            'answer' => 'seulement la réponse',
        ])->assertStatus(422)->assertJsonValidationErrors(['keyboard']);
    }

    public function test_update_requires_admin(): void
    {
        $question = Question::factory()->withBlock()->create();
        $payload = ['keyboard' => 'standard', 'answer' => 'x'];

        $this->patchJson(route('api.admin.questions.update', $question), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.questions.update', $question), $payload)
            ->assertForbidden();
    }

    public function test_destroy_deletes_and_renumbers_remaining_questions(): void
    {
        $this->actingAsAdmin();
        $quizz = Quizz::factory()->create();
        $q1 = Question::factory()->forQuestionable($quizz)->create(['order' => 1]);
        $q2 = Question::factory()->forQuestionable($quizz)->create(['order' => 2]);
        $q3 = Question::factory()->forQuestionable($quizz)->create(['order' => 3]);

        $this->deleteJson(route('api.admin.questions.destroy', $q2))
            ->assertStatus(200);

        $this->assertModelMissing($q2);
        // Les questions restantes sont renumérotées 1..n.
        $this->assertSame(1, $q1->fresh()->order);
        $this->assertSame(2, $q3->fresh()->order);
    }

    public function test_destroy_requires_admin(): void
    {
        $question = Question::factory()->withBlock()->create();

        $this->deleteJson(route('api.admin.questions.destroy', $question))
            ->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.questions.destroy', $question))
            ->assertForbidden();

        $this->assertModelExists($question);
    }
}