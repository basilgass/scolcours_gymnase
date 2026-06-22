<?php

namespace Tests\Feature\Posts;

use App\Models\Block;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PostWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_redirects_to_the_chapter_post_route(): void
    {
        $post = Post::factory()->create(['order' => 3]);

        $this->get(route('posts.show', $post))
            ->assertRedirect(route('themes.chapters.posts.show', [
                $post->chapter->theme,
                $post->chapter,
                $post->order,
            ]));
    }

    public function test_anchor_redirects_to_the_block_anchor_route(): void
    {
        $post = Post::factory()->create(['order' => 2]);
        $block = Block::factory()->forBlockable($post)->create();

        $this->get(route('posts.blocks.anchor', [$post, $block]))
            ->assertRedirect(route('themes.chapters.posts.anchor', [
                $post->chapter->theme,
                $post->chapter,
                $post->order,
                'block',
                $block->id,
            ]));
    }

    public function test_edit_renders_inertia_page_for_admin(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();

        $this->get(route('admin.posts.edit', $post))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Posts/PostEdit')
                ->where('post.id', $post->id));
    }

    public function test_edit_is_restricted_to_admins(): void
    {
        $post = Post::factory()->create();

        // Invité : redirigé vers le login.
        $this->get(route('admin.posts.edit', $post))->assertStatus(302);

        // Authentifié non-admin : interdit.
        $this->actingAsUser();
        $this->get(route('admin.posts.edit', $post))->assertForbidden();
    }
}
