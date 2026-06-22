<?php

namespace Tests\Feature\Blocks;

use App\Models\Block;
use App\Models\Illustration;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlockApiActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_move_a_block_to_another_blockable(): void
    {
        $this->actingAsAdmin();
        $source = Post::factory()->create();
        $target = Post::factory()->create(['title' => 'Destination']);
        $block = Block::factory()->forBlockable($source)->create(['order' => 1]);
        // La cible a déjà un block : le block déplacé prend l'ordre suivant.
        Block::factory()->forBlockable($target)->create(['order' => 1]);

        $this->patchJson(route('api.admin.blocks.move', $block), [
            'target_type' => 'post',
            'target_id'   => $target->id,
        ])->assertStatus(200)
            ->assertJsonPath('label', 'Destination');

        $block->refresh();
        $this->assertSame($target->id, $block->blockable_id);
        $this->assertSame(Post::class, $block->blockable_type);
        $this->assertSame(2, $block->order);
    }

    public function test_move_requires_target_fields(): void
    {
        $this->actingAsAdmin();
        $block = Block::factory()->forBlockable(Post::factory()->create())->create();

        $this->patchJson(route('api.admin.blocks.move', $block), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['target_id', 'target_type']);
    }

    public function test_move_requires_admin(): void
    {
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create();
        $payload = ['target_type' => 'post', 'target_id' => $post->id];

        $this->patchJson(route('api.admin.blocks.move', $block), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.blocks.move', $block), $payload)->assertForbidden();
    }

    public function test_admin_can_reorder_illustrations_of_a_block(): void
    {
        $this->actingAsAdmin();
        $block = Block::factory()->forBlockable(Post::factory()->create())->create();
        $i1 = Illustration::factory()->forBlock($block)->create(['order' => 1]);
        $i2 = Illustration::factory()->forBlock($block)->create(['order' => 2]);

        $this->patchJson(route('api.admin.blocks.illustrations.order', $block), [
            'order' => [
                ['id' => $i1->id, 'order' => 2],
                ['id' => $i2->id, 'order' => 1],
            ],
        ])->assertNoContent();

        $this->assertSame(2, $i1->fresh()->order);
        $this->assertSame(1, $i2->fresh()->order);
    }

    public function test_reorder_illustrations_validates_existing_ids(): void
    {
        $this->actingAsAdmin();
        $block = Block::factory()->forBlockable(Post::factory()->create())->create();

        $this->patchJson(route('api.admin.blocks.illustrations.order', $block), [
            'order' => [['id' => 99999, 'order' => 1]],
        ])->assertStatus(422)->assertJsonValidationErrors(['order.0.id']);
    }

    public function test_reorder_illustrations_requires_admin(): void
    {
        $block = Block::factory()->forBlockable(Post::factory()->create())->create();

        $this->patchJson(route('api.admin.blocks.illustrations.order', $block), ['order' => []])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.blocks.illustrations.order', $block), ['order' => []])
            ->assertForbidden();
    }

    public function test_admin_can_fetch_blockable_url(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create();

        // redirectUrl() résout vers l'ancre du parent (posts.blocks.anchor).
        $this->getJson(route('api.admin.blocks.blockable.url', $block))
            ->assertStatus(200)
            ->assertSee($post->order, false);
    }

    public function test_fetch_blockable_url_requires_admin(): void
    {
        $block = Block::factory()->forBlockable(Post::factory()->create())->create();

        $this->getJson(route('api.admin.blocks.blockable.url', $block))->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.blocks.blockable.url', $block))->assertForbidden();
    }
}
