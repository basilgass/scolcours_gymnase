<?php

namespace Tests\Feature\Chapters;

use App\Models\Chapter;
use App\Models\Post;
use App\Models\Theme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ChapterWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_theme_index_shows_all_chapters_to_admin(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();
        Chapter::factory()->create(['theme_id' => $theme->id, 'active' => true]);
        Chapter::factory()->create(['theme_id' => $theme->id, 'active' => false]);

        $this->get(route('themes.show', $theme))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Chapters/ChapterIndex')
                ->has('chapters', 2));
    }

    public function test_theme_index_hides_inactive_chapters_from_guests(): void
    {
        $theme = Theme::factory()->create();
        Chapter::factory()->create(['theme_id' => $theme->id, 'active' => true]);
        Chapter::factory()->create(['theme_id' => $theme->id, 'active' => false]);

        $this->get(route('themes.show', $theme))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Chapters/ChapterIndex')
                ->has('chapters', 1));
    }

    public function test_bare_chapters_index_renders_empty_for_unbound_theme(): void
    {
        // Quirk : la route /chapters appelle index(Theme $theme) sans paramètre
        // → Theme vide → aucune chapter. Caractérisé.
        $this->get(route('chapters.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Chapters/ChapterIndex')
                ->has('chapters', 0));
    }

    public function test_show_renders_the_chapter_page_publicly(): void
    {
        $chapter = Chapter::factory()->create();

        $this->get(route('themes.chapters.show', [$chapter->theme, $chapter]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Chapters/ChapterShow')
                ->where('chapter.id', $chapter->id));
    }

    public function test_chapters_shortcut_redirects_permanently_to_the_canonical_url(): void
    {
        $chapter = Chapter::factory()->create();

        // /chapters/{id} est un raccourci : 301 vers l'URL canonique {theme}/{chapter}.
        $this->get(route('chapters.show', $chapter))
            ->assertStatus(301)
            ->assertRedirect(route('themes.chapters.show', [$chapter->theme, $chapter]));
    }

    public function test_slide_renders_a_post_by_order_publicly(): void
    {
        $chapter = Chapter::factory()->create();
        $post = Post::factory()->forChapter($chapter)->create(['order' => 1, 'active' => true]);

        $this->get(route('themes.chapters.posts.show', [$chapter->theme, $chapter, 1]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Chapters/ChapterPostShow')
                ->where('post.id', $post->id));
    }

    public function test_edit_renders_inertia_page_for_admin(): void
    {
        $this->actingAsAdmin();
        $chapter = Chapter::factory()->create();

        $this->get(route('admin.chapters.edit', $chapter))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Chapters/ChapterEdit')
                ->where('chapter.id', $chapter->id));
    }

    public function test_edit_is_restricted_to_admins(): void
    {
        $chapter = Chapter::factory()->create();

        $this->get(route('admin.chapters.edit', $chapter))->assertStatus(302);

        $this->actingAsUser();
        $this->get(route('admin.chapters.edit', $chapter))->assertForbidden();
    }
}
