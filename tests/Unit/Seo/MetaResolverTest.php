<?php

namespace Tests\Unit\Seo;

use App\Models\Chapter;
use App\Models\Deck;
use App\Models\Theme;
use App\Models\Tool;
use App\Services\Seo\MetaResolver;
use App\Services\Seo\MetaSource;
use App\Services\Seo\SitemapEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MetaResolverTest extends TestCase
{
    use RefreshDatabase;

    private function resolve(SitemapEntry $entry)
    {
        return app(MetaResolver::class)->resolve($entry);
    }

    public function test_chapter_title_uses_the_theme_as_context_and_body_as_description(): void
    {
        $theme = Theme::factory()->create(['title' => 'Algèbre']);
        $chapter = Chapter::factory()->create(['theme_id' => $theme->id, 'title' => 'Racines']);
        $chapter->blocks()->first()->update(['body' => '<p>Étude des racines carrées.</p>']);

        $meta = $this->resolve(new SitemapEntry('/x', 'themes.chapters.show', $chapter->fresh()));

        $this->assertSame('Racines — Algèbre | Scolcours', $meta->title);
        $this->assertSame('Étude des racines carrées.', $meta->description);
        $this->assertSame(MetaSource::Block, $meta->source);
    }

    public function test_tool_uses_its_body_column_and_type_label(): void
    {
        $tool = Tool::factory()->create(['title' => 'Grapheur', 'body' => 'Tracer des fonctions.']);

        $meta = $this->resolve(new SitemapEntry('/x', 'tools.show', $tool));

        $this->assertSame('Grapheur — Outil | Scolcours', $meta->title);
        $this->assertSame('Tracer des fonctions.', $meta->description);
        $this->assertSame(MetaSource::Body, $meta->source);
    }

    public function test_deck_without_content_falls_back_to_empty_template(): void
    {
        $deck = Deck::factory()->create(['title' => 'Vecteurs']);

        $meta = $this->resolve(new SitemapEntry('/x', 'decks.show', $deck));

        $this->assertSame('Vecteurs — Cartes | Scolcours', $meta->title);
        $this->assertSame('', $meta->description);
        $this->assertSame(MetaSource::Template, $meta->source);
    }

    public function test_stored_override_wins_over_derivation(): void
    {
        $tool = Tool::factory()->create(['title' => 'Grapheur', 'body' => 'Body dérivé.']);
        $tool->meta()->create([
            'meta_title'       => 'Titre choisi',
            'meta_description' => 'Description choisie.',
        ]);

        $meta = $this->resolve(new SitemapEntry('/x', 'tools.show', $tool->fresh()));

        $this->assertSame('Titre choisi — Outil | Scolcours', $meta->title);
        $this->assertSame('Description choisie.', $meta->description);
        $this->assertSame(MetaSource::Override, $meta->source);
    }

    public function test_static_page_reads_from_config(): void
    {
        $meta = $this->resolve(new SitemapEntry(url('/'), 'home'));

        $this->assertSame('Scolcours — mathématiques au gymnase', $meta->title);
        $this->assertSame(MetaSource::Template, $meta->source);
    }
}
