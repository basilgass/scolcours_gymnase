<?php

namespace Tests\Feature\Chapters;

use App\Models\Block;
use App\Models\Chapter;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChapterApiActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_posts_returns_chapter_posts_publicly(): void
    {
        $chapter = Chapter::factory()->create();
        $p1 = Post::factory()->forChapter($chapter)->create(['order' => 1, 'title' => 'Intro']);
        $p2 = Post::factory()->forChapter($chapter)->create(['order' => 2, 'title' => 'Suite']);

        $this->getJson(route('api.chapters.posts.index', $chapter))
            ->assertStatus(200)
            ->assertJsonFragment(['id' => $p1->id, 'title' => 'Intro'])
            ->assertJsonFragment(['id' => $p2->id, 'title' => 'Suite']);
    }

    public function test_get_theorems_returns_only_theorem_like_blocks(): void
    {
        $chapter = Chapter::factory()->create();
        $post = Post::factory()->forChapter($chapter)->create();
        $theorem = Block::factory()->forBlockable($post)->ofType('theorem')->create();
        Block::factory()->forBlockable($post)->ofType('text')->create();

        $this->getJson(route('api.chapters.theorems.index', $chapter))
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $theorem->id);
    }

    public function test_admin_can_activate_and_deactivate_a_chapter(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create(['active' => true]);

        $this->patchJson(route('api.admin.chapters.active', $chapter), ['active' => false])
            ->assertStatus(200);

        $this->assertFalse((bool) $chapter->fresh()->active);
    }

    public function test_activate_requires_a_boolean(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();

        $this->patchJson(route('api.admin.chapters.active', $chapter), [])
            ->assertStatus(422)->assertJsonValidationErrors(['active']);
    }

    public function test_activate_requires_admin(): void
    {
        $chapter = Chapter::factory()->create();

        $this->patchJson(route('api.admin.chapters.active', $chapter), ['active' => false])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.chapters.active', $chapter), ['active' => false])
            ->assertForbidden();
    }

    public function test_admin_can_reorder_posts(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();
        $p1 = Post::factory()->forChapter($chapter)->create(['order' => 1]);
        $p2 = Post::factory()->forChapter($chapter)->create(['order' => 2]);

        $this->patchJson(route('api.admin.chapters.posts.order', $chapter), [
            'posts' => [
                ['id' => $p1->id, 'order' => 2],
                ['id' => $p2->id, 'order' => 1],
            ],
        ])->assertStatus(200);

        $this->assertSame(2, $p1->fresh()->order);
        $this->assertSame(1, $p2->fresh()->order);
    }

    public function test_reorder_posts_requires_admin(): void
    {
        $chapter = Chapter::factory()->create();

        $this->patchJson(route('api.admin.chapters.posts.order', $chapter), ['posts' => []])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.chapters.posts.order', $chapter), ['posts' => []])
            ->assertForbidden();
    }

    public function test_admin_can_toggle_a_related_chapter(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();
        $related = Chapter::factory()->create();

        // Premier appel : attache la relation.
        $this->postJson(route('api.admin.chapters.relations.toggle', [$chapter, $related]))
            ->assertStatus(200);
        $this->assertTrue($chapter->relations()->where('related_id', $related->id)->exists());

        // Second appel : détache.
        $this->postJson(route('api.admin.chapters.relations.toggle', [$chapter, $related]))
            ->assertStatus(200);
        $this->assertFalse($chapter->relations()->where('related_id', $related->id)->exists());
    }

    public function test_toggle_related_with_self_returns_false(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();

        // return false → Laravel caste le bool en chaîne vide (cf. toggleTeam B3d).
        $this->postJson(route('api.admin.chapters.relations.toggle', [$chapter, $chapter]))
            ->assertStatus(200)
            ->assertContent('');

        $this->assertSame(0, $chapter->relations()->count());
    }

    public function test_toggle_related_requires_admin(): void
    {
        $chapter = Chapter::factory()->create();
        $related = Chapter::factory()->create();

        $this->postJson(route('api.admin.chapters.relations.toggle', [$chapter, $related]))
            ->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.chapters.relations.toggle', [$chapter, $related]))
            ->assertForbidden();
    }
}
