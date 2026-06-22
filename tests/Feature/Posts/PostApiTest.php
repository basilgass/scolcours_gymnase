<?php

namespace Tests\Feature\Posts;

use App\Models\Chapter;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lists_posts_publicly(): void
    {
        $post = Post::factory()->create(['title' => 'Mon post']);

        $this->getJson(route('api.posts.index'))
            ->assertStatus(200)
            ->assertJsonFragment(['id' => $post->id, 'title' => 'Mon post']);
    }

    public function test_show_returns_the_post_resource_publicly(): void
    {
        $post = Post::factory()->withBlock()->create(['title' => 'Détail']);

        $this->getJson(route('api.posts.show', $post))
            ->assertStatus(200)
            ->assertJsonPath('id', $post->id)
            ->assertJsonPath('title', 'Détail')
            ->assertJsonPath('blocks.0.body', 'sans contenu');
    }

    public function test_info_returns_only_the_title_publicly(): void
    {
        $post = Post::factory()->create(['title' => 'Titre court']);

        $this->getJson(route('api.posts.info', $post))
            ->assertStatus(200)
            ->assertExactJson(['title' => 'Titre court']);
    }

    public function test_admin_can_create_a_post_with_next_order(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();
        Post::factory()->forChapter($chapter)->create(['order' => 1]);

        $response = $this->postJson(route('api.admin.posts.store'), [
            'title'      => 'Nouveau post',
            'chapter_id' => $chapter->id,
        ])->assertStatus(201);

        $created = Post::find($response->json('id'));
        $this->assertNotNull($created);
        $this->assertSame('Nouveau post', $created->title);
        $this->assertSame($chapter->id, $created->chapter_id);
        // order = nombre de posts existants + 1
        $this->assertSame(2, $created->order);
    }

    public function test_store_validates_required_fields(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.posts.store'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'chapter_id']);
    }

    public function test_store_rejects_unknown_chapter(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.posts.store'), [
            'title'      => 'Orphelin',
            'chapter_id' => 99999,
        ])->assertStatus(422)->assertJsonValidationErrors(['chapter_id']);
    }

    public function test_store_requires_admin(): void
    {
        $chapter = Chapter::factory()->create();
        $payload = ['title' => 'X', 'chapter_id' => $chapter->id];

        $this->postJson(route('api.admin.posts.store'), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.posts.store'), $payload)->assertForbidden();

        $this->assertSame(0, Post::count());
    }

    public function test_admin_can_update_all_attributes(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create(['title' => 'Avant', 'active' => false, 'revise' => false]);

        $this->patchJson(route('api.admin.posts.update', $post), [
            'title'         => 'Après',
            'active'        => true,
            'revise'        => true,
            'script'        => 'console.log(1)',
            'switch'        => 'on',
            'type'          => 'lesson',
            'questionsGrid' => '[]',
        ])->assertStatus(200);

        $post->refresh();
        $this->assertSame('Après', $post->title);
        $this->assertTrue((bool) $post->active);
        $this->assertTrue((bool) $post->revise);
        $this->assertSame('console.log(1)', $post->script);
        $this->assertSame('lesson', $post->type);
    }

    public function test_update_with_partial_payload_does_not_crash(): void
    {
        $this->actingAsAdmin();
        // active/revise ne sont pas required ; le contrôleur les lisait sans garde
        // (bug : « Undefined array key » → 500). Corrigé dans ce lot (Option A).
        $post = Post::factory()->create(['title' => 'Initial', 'active' => true, 'revise' => false]);

        $this->patchJson(route('api.admin.posts.update', $post), [
            'title' => 'Modifié seul',
        ])->assertStatus(200);

        $post->refresh();
        $this->assertSame('Modifié seul', $post->title);
        // Les valeurs non transmises sont préservées.
        $this->assertTrue((bool) $post->active);
        $this->assertFalse((bool) $post->revise);
    }

    public function test_update_validates_boolean_fields(): void
    {
        $this->actingAsAdmin();
        $post = Post::factory()->create();

        $this->patchJson(route('api.admin.posts.update', $post), [
            'active' => 'pas-un-booleen',
        ])->assertStatus(422)->assertJsonValidationErrors(['active']);
    }

    public function test_update_requires_admin(): void
    {
        $post = Post::factory()->create();
        $payload = ['title' => 'Hack'];

        $this->patchJson(route('api.admin.posts.update', $post), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.posts.update', $post), $payload)->assertForbidden();
    }

    public function test_admin_can_destroy_a_post_and_reorder_chapter(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();
        $p1 = Post::factory()->forChapter($chapter)->create(['order' => 1]);
        $p2 = Post::factory()->forChapter($chapter)->withBlock()->create(['order' => 2]);
        $p3 = Post::factory()->forChapter($chapter)->create(['order' => 3]);

        $this->deleteJson(route('api.admin.posts.destroy', $p2))
            ->assertNoContent();

        $this->assertModelMissing($p2);
        // Les blocks du post supprimé sont retirés.
        $this->assertSame(0, $p2->blocks()->count());
        // Les posts restants sont renumérotés 1..n.
        $this->assertSame(1, $p1->fresh()->order);
        $this->assertSame(2, $p3->fresh()->order);
    }

    public function test_destroy_requires_admin(): void
    {
        $post = Post::factory()->create();

        $this->deleteJson(route('api.admin.posts.destroy', $post))->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.posts.destroy', $post))->assertForbidden();

        $this->assertModelExists($post);
    }
}
