<?php

namespace Tests\Feature\Blocks;

use App\Models\Block;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BlockWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_scripted_blocks_for_admin(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();
        // Seuls les blocks avec un script remontent dans l'index admin.
        Block::factory()->forBlockable($post)->create(['script' => 'doThing()']);
        Block::factory()->forBlockable($post)->create(['script' => null]);

        $this->get(route('admin.blocks.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Blocks/admin/AdminBlock')
                ->has('blocks', 1));
    }

    public function test_index_is_restricted_to_admins(): void
    {
        $this->get(route('admin.blocks.index'))->assertStatus(302);

        $this->actingAsUser();
        $this->get(route('admin.blocks.index'))->assertForbidden();
    }

    public function test_show_redirects_to_the_blockable_anchor(): void
    {
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create();

        $this->get(route('blocks.show', $block))
            ->assertRedirect(route('posts.blocks.anchor', [$post, $block]));
    }

    public function test_show_aborts_404_when_blockable_is_missing(): void
    {
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create();
        // On orpheline le block : son parent n'existe plus → redirectUrl() = null → 404.
        $post->delete();

        $this->get(route('blocks.show', $block))->assertNotFound();
    }

    public function test_edit_renders_inertia_page_for_admin(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create();

        $this->get(route('admin.blocks.edit', $block))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Blocks/BlockEdit')
                ->where('block.id', $block->id));
    }

    public function test_edit_is_restricted_to_admins(): void
    {
        $post = Post::factory()->create();
        $block = Block::factory()->forBlockable($post)->create();

        $this->get(route('admin.blocks.edit', $block))->assertStatus(302);

        $this->actingAsUser();
        $this->get(route('admin.blocks.edit', $block))->assertForbidden();
    }
}
