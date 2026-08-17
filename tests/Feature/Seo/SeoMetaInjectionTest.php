<?php

namespace Tests\Feature\Seo;

use App\Models\Chapter;
use App\Models\Theme;
use App\Models\Tool;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SeoMetaInjectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_chapter_page_exposes_resolved_title_and_description(): void
    {
        $theme = Theme::factory()->create(['title' => 'Algèbre']);
        $chapter = Chapter::factory()->create(['theme_id' => $theme->id, 'title' => 'Racines']);
        $chapter->blocks()->first()->update(['body' => '<p>Étude des racines carrées.</p>']);

        $response = $this->get(route('themes.chapters.show', [$theme, $chapter]));

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->where('meta.title', 'Racines — Algèbre | Scolcours')
                ->where('meta.description', 'Étude des racines carrées.')
                ->etc());

        // La description doit être injectée dans le <head> serveur, pas seulement dans le prop.
        $response->assertSee('name="description"', false);
        $response->assertSee('Étude des racines carrées.', false);
    }

    public function test_static_page_reads_meta_from_config(): void
    {
        $response = $this->get(route('formulas.index'));

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->has('meta.title')
                ->has('meta.description')
                ->etc());

        $response->assertSee('name="description"', false);
    }

    public function test_override_description_is_injected(): void
    {
        $tool = Tool::factory()->create(['title' => 'Grapheur', 'body' => 'Body dérivé.']);
        $tool->meta()->create(['meta_description' => 'Description choisie pour le SEO.']);

        $response = $this->get(route('tools.show', $tool->slug));

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->where('meta.description', 'Description choisie pour le SEO.')
                ->etc());

        $response->assertSee('Description choisie pour le SEO.', false);
    }
}
