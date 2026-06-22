<?php

namespace Tests\Feature\Blocks;

use App\Models\Block;
use App\Models\Chapter;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlockApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_without_parameters_returns_no_content(): void
    {
        $this->getJson(route('api.blocks.index'))->assertNoContent();
    }

    public function test_index_by_chapter_id_returns_chapter_blocks(): void
    {
        // Un chapitre crée automatiquement un block (Chapter::booted).
        $chapter = Chapter::factory()->create();

        $this->getJson(route('api.blocks.index', ['chapter_id' => $chapter->id]))
            ->assertStatus(200)
            ->assertJsonCount($chapter->blocks()->count());
    }

    public function test_index_by_ids_returns_blocks_in_requested_order(): void
    {
        $post = Post::factory()->create();
        $b1 = Block::factory()->forBlockable($post)->create();
        $b2 = Block::factory()->forBlockable($post)->create();
        $b3 = Block::factory()->forBlockable($post)->create();

        // L'ordre demandé (b3, b1, b2) doit être respecté dans la réponse.
        // Le tri d'origine reposait sur FIELD() (MySQL only) → 500 sur SQLite.
        // Corrigé dans ce lot (Option A, bug #2).
        $response = $this->getJson(route('api.blocks.index', ['ids' => [$b3->id, $b1->id, $b2->id]]))
            ->assertStatus(200);

        $this->assertSame(
            [$b3->id, $b1->id, $b2->id],
            array_column($response->json(), 'id')
        );
    }

    public function test_show_returns_the_block_resource_publicly(): void
    {
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create(['body' => 'Visible']);

        $this->getJson(route('api.blocks.show', $block))
            ->assertStatus(200)
            ->assertJsonPath('id', $block->id)
            ->assertJsonPath('body', 'Visible');
    }

    public function test_admin_can_create_a_block_on_a_post(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();

        $response = $this->postJson(route('api.admin.blocks.store'), [
            'target_type' => 'post',
            'target_id'   => $post->id,
            'type'        => 'text',
            'body'        => 'Nouveau contenu',
        ])->assertStatus(201);

        $this->assertDatabaseHas('blocks', [
            'id'             => $response->json('id'),
            'blockable_id'   => $post->id,
            'blockable_type' => Post::class,
            'body'           => 'Nouveau contenu',
        ]);
    }

    public function test_store_requires_target_fields(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.blocks.store'), ['type' => 'text'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['target_id', 'target_type']);
    }

    public function test_store_requires_admin(): void
    {
        $post = Post::factory()->create();
        $payload = ['target_type' => 'post', 'target_id' => $post->id, 'type' => 'text'];

        $this->postJson(route('api.admin.blocks.store'), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.blocks.store'), $payload)->assertForbidden();
    }

    public function test_admin_can_update_a_block(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create(['body' => 'Avant']);

        $this->patchJson(route('api.admin.blocks.update', $block), [
            'body' => 'Après',
            'type' => 'theorem',
        ])->assertStatus(200)
            ->assertJsonPath('body', 'Après');

        $block->refresh();
        $this->assertSame('Après', $block->body);
        $this->assertSame('theorem', $block->type);
    }

    public function test_update_with_order_shifts_siblings(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();
        $b1 = Block::factory()->forBlockable($post)->create(['order' => 1]);
        $b2 = Block::factory()->forBlockable($post)->create(['order' => 2]);

        // On replace b2 en position 1 : b1 (order >= 1) est décalé.
        $this->patchJson(route('api.admin.blocks.update', $b2), ['order' => 1])
            ->assertStatus(200);

        $this->assertSame(1, $b2->fresh()->order);
        $this->assertSame(2, $b1->fresh()->order);
    }

    public function test_update_requires_admin(): void
    {
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create();

        $this->patchJson(route('api.admin.blocks.update', $block), ['body' => 'x'])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.blocks.update', $block), ['body' => 'x'])
            ->assertForbidden();
    }

    public function test_admin_can_destroy_a_block_and_get_parent_url(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create();

        // Le parent (Post) expose une méthode url() → destroy renvoie son URL.
        $this->deleteJson(route('api.admin.blocks.destroy', $block))
            ->assertStatus(200);

        $this->assertModelMissing($block);
    }

    public function test_destroy_requires_admin(): void
    {
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create();

        $this->deleteJson(route('api.admin.blocks.destroy', $block))->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.blocks.destroy', $block))->assertForbidden();

        $this->assertModelExists($block);
    }
}
