<?php

namespace Tests\Feature\Posts;

use App\Models\Block;
use App\Models\Chapter;
use App\Models\Post;
use App\Models\Question;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostApiActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_duplicate_a_post_with_its_blocks_and_questions(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();
        $post = Post::factory()->forChapter($chapter)->create([
            'title'  => 'Exercice 3',
            'active' => true,
            'order'  => 1,
        ]);
        // Donnée : deux blocks, le premier avec des illustrations.
        Block::factory()->forBlockable($post)->withIllustrations(2)->create(['order' => 1]);
        Block::factory()->forBlockable($post)->create(['order' => 2]);
        // Deux questions, chacune avec son block.
        Question::factory()->forQuestionable($post)->withBlock()->create(['order' => 1]);
        Question::factory()->forQuestionable($post)->withBlock()->create(['order' => 2]);

        // 201 : la Resource enveloppe un modèle fraîchement créé (wasRecentlyCreated).
        $response = $this->postJson(route('api.admin.posts.duplicate', $post))
            ->assertStatus(201)
            ->assertJsonPath('title', 'Exercice 3 (copie)')
            ->assertJsonPath('active', 0);

        $newId = $response->json('id');
        $this->assertNotSame($post->id, $newId);

        $copy = Post::findOrFail($newId);
        $this->assertSame($chapter->id, $copy->chapter_id);
        $this->assertFalse((bool) $copy->active);
        $this->assertSame(2, $copy->order); // placé en fin de chapitre

        // Copie profonde de la donnée + illustrations.
        $this->assertCount(2, $copy->blocks);
        $this->assertSame(2, $copy->blocks->first()->illustrations->count());

        // Copie des questions et de leurs blocks.
        $this->assertCount(2, $copy->questions);
        foreach ($copy->questions as $question) {
            $this->assertCount(1, $question->blocks);
        }

        // L'original reste intact.
        $this->assertCount(2, $post->fresh()->blocks);
        $this->assertCount(2, $post->fresh()->questions);
    }

    public function test_duplicate_requires_admin(): void
    {
        $post = Post::factory()->create();

        $this->postJson(route('api.admin.posts.duplicate', $post))->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.posts.duplicate', $post))->assertForbidden();
    }

    public function test_admin_can_move_a_post_to_another_chapter(): void
    {
        $this->actingAsAdmin();
        $source = Chapter::factory()->create();
        $target = Chapter::factory()->create(['title' => 'Cible']);
        $post = Post::factory()->forChapter($source)->create(['order' => 1]);
        // La cible a déjà un post : le post déplacé prend l'ordre suivant.
        Post::factory()->forChapter($target)->create(['order' => 1]);

        $this->patchJson(route('api.admin.posts.move', $post), [
            'target_type' => 'chapter',
            'target_id'   => $target->id,
        ])->assertStatus(200)
            ->assertJsonPath('label', 'Cible');

        $post->refresh();
        $this->assertSame($target->id, $post->chapter_id);
        $this->assertSame(2, $post->order);
    }

    public function test_move_requires_target_fields(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();

        $this->patchJson(route('api.admin.posts.move', $post), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['target_id', 'target_type']);
    }

    public function test_move_requires_admin(): void
    {
        $post = Post::factory()->create();
        $payload = ['target_type' => 'chapter', 'target_id' => $post->chapter_id];

        $this->patchJson(route('api.admin.posts.move', $post), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.posts.move', $post), $payload)->assertForbidden();
    }

    public function test_admin_can_reorder_blocks_of_a_post(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();
        $b1 = Block::factory()->forBlockable($post)->create(['order' => 1]);
        $b2 = Block::factory()->forBlockable($post)->create(['order' => 2]);

        $this->patchJson(route('api.admin.posts.blocks.order', $post), [
            'order' => [
                ['id' => $b1->id, 'order' => 2],
                ['id' => $b2->id, 'order' => 1],
            ],
        ])->assertNoContent();

        $this->assertSame(2, $b1->fresh()->order);
        $this->assertSame(1, $b2->fresh()->order);
    }

    public function test_reorder_blocks_validates_existing_ids(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();

        $this->patchJson(route('api.admin.posts.blocks.order', $post), [
            'order' => [
                ['id' => 99999, 'order' => 1],
            ],
        ])->assertStatus(422)->assertJsonValidationErrors(['order.0.id']);
    }

    public function test_reorder_blocks_requires_admin(): void
    {
        $post = Post::factory()->create();

        $this->patchJson(route('api.admin.posts.blocks.order', $post), ['order' => []])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.posts.blocks.order', $post), ['order' => []])
            ->assertForbidden();
    }

    public function test_admin_can_reset_answers_of_a_post(): void
    {
        $admin = $this->actingAsAdmin();
        $post = Post::factory()->create();
        Question::factory()->forQuestionable($post)->withBlock()->create();

        // Sans score existant pour l'admin, resetAnswer est un no-op : la route
        // doit néanmoins répondre 204 sans erreur.
        $this->patchJson(route('api.admin.posts.answers.reset', $post))
            ->assertNoContent();
    }

    public function test_reset_answers_requires_admin(): void
    {
        $post = Post::factory()->create();

        $this->patchJson(route('api.admin.posts.answers.reset', $post))->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.posts.answers.reset', $post))->assertForbidden();
    }

    public function test_admin_can_update_questions_grid(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();

        $this->patchJson(route('api.admin.posts.questions.grid', $post), [
            'grid' => '[[1,2],[3,4]]',
        ])->assertStatus(200)
            ->assertJsonPath('grid', '[[1,2],[3,4]]');

        $this->assertSame('[[1,2],[3,4]]', $post->fresh()->questionsGrid);
    }

    public function test_update_questions_grid_requires_admin(): void
    {
        $post = Post::factory()->create();

        $this->patchJson(route('api.admin.posts.questions.grid', $post), ['grid' => 'x'])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.posts.questions.grid', $post), ['grid' => 'x'])
            ->assertForbidden();
    }

    public function test_admin_can_toggle_revised_flag(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create(['revise' => false]);

        $this->patchJson(route('api.admin.posts.revised', $post), ['revise' => true])
            ->assertStatus(200)
            ->assertJsonPath('revise', 1);

        $this->assertTrue((bool) $post->fresh()->revise);
    }

    public function test_revised_requires_a_boolean(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();

        $this->patchJson(route('api.admin.posts.revised', $post), [])
            ->assertStatus(422)->assertJsonValidationErrors(['revise']);
    }

    public function test_revised_requires_admin(): void
    {
        $post = Post::factory()->create();

        $this->patchJson(route('api.admin.posts.revised', $post), ['revise' => true])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.posts.revised', $post), ['revise' => true])
            ->assertForbidden();
    }
}
