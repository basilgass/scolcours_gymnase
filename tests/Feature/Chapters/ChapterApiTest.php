<?php

namespace Tests\Feature\Chapters;

use App\Models\Chapter;
use App\Models\Theme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChapterApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_by_theme_lists_chapters_publicly(): void
    {
        $theme = Theme::factory()->create();
        $chapter = Chapter::factory()->create(['theme_id' => $theme->id, 'title' => 'Algèbre']);

        $this->getJson(route('api.themes.chapters.index', $theme))
            ->assertStatus(200)
            ->assertJsonFragment(['id' => $chapter->id, 'title' => 'Algèbre']);
    }

    public function test_admin_fetch_filters_by_ids(): void
    {
        $this->actingAsAdmin();
        $a = Chapter::factory()->create();
        $b = Chapter::factory()->create();
        Chapter::factory()->create();

        $response = $this->getJson(route('api.admin.chapters.index', ['ids' => "{$a->id},{$b->id}"]))
            ->assertStatus(200);

        $ids = array_column($response->json(), 'id');
        sort($ids);
        $this->assertSame([$a->id, $b->id], $ids);
    }

    public function test_admin_fetch_requires_admin(): void
    {
        $this->getJson(route('api.admin.chapters.index'))->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.chapters.index'))->assertForbidden();
    }

    public function test_info_returns_only_title_publicly(): void
    {
        $chapter = Chapter::factory()->create(['title' => 'Géométrie']);

        $this->getJson(route('api.chapters.info', $chapter))
            ->assertStatus(200)
            ->assertExactJson(['title' => 'Géométrie']);
    }

    public function test_admin_can_create_a_chapter_under_a_theme(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();

        $response = $this->postJson(route('api.admin.themes.chapters.store', $theme), [
            'title' => 'Nouveau chapitre',
        ])->assertStatus(201);

        $chapter = Chapter::find($response->json('id'));
        $this->assertNotNull($chapter);
        $this->assertSame($theme->id, $chapter->theme_id);
        $this->assertSame('nouveau-chapitre', $chapter->slug);

        // Dette caractérisée : Chapter::booted() crée déjà un block, et store en
        // crée un second (« Aucune extrait... ») → double block (smell B5a).
        $this->assertSame(2, $chapter->blocks()->count());
    }

    public function test_store_validates_title(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();

        $this->postJson(route('api.admin.themes.chapters.store', $theme), ['title' => 'x'])
            ->assertStatus(422)->assertJsonValidationErrors(['title']);
    }

    public function test_store_requires_admin(): void
    {
        $theme = Theme::factory()->create();
        $payload = ['title' => 'Chapitre'];

        $this->postJson(route('api.admin.themes.chapters.store', $theme), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.themes.chapters.store', $theme), $payload)
            ->assertForbidden();
    }

    public function test_admin_can_update_a_chapter_and_its_block(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create(['title' => 'Avant', 'slug' => 'avant']);

        $this->patchJson(route('api.admin.chapters.update', $chapter), [
            'title' => 'Après',
            'slug'  => 'apres',
            'block' => ['body' => 'Extrait mis à jour'],
        ])->assertStatus(200)
            ->assertJsonPath('title', 'Après');

        $chapter->refresh();
        $this->assertSame('Après', $chapter->title);
        $this->assertSame('apres', $chapter->slug);
        // Le block du chapitre (auto-créé) reçoit le body transmis.
        $this->assertSame('Extrait mis à jour', $chapter->blocks[0]->body);
    }

    public function test_update_validates_required_fields(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();

        $this->patchJson(route('api.admin.chapters.update', $chapter), ['title' => 'x'])
            ->assertStatus(422)->assertJsonValidationErrors(['title', 'slug']);
    }

    public function test_update_requires_admin(): void
    {
        $chapter = Chapter::factory()->create();
        $payload = ['title' => 'Hack', 'slug' => 'hack'];

        $this->patchJson(route('api.admin.chapters.update', $chapter), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.chapters.update', $chapter), $payload)
            ->assertForbidden();
    }

    public function test_admin_can_destroy_a_chapter(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();

        $this->deleteJson(route('api.admin.chapters.destroy', $chapter))
            ->assertStatus(200);

        $this->assertModelMissing($chapter);
    }

    public function test_destroy_requires_admin(): void
    {
        $chapter = Chapter::factory()->create();

        $this->deleteJson(route('api.admin.chapters.destroy', $chapter))->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.chapters.destroy', $chapter))->assertForbidden();

        $this->assertModelExists($chapter);
    }
}
