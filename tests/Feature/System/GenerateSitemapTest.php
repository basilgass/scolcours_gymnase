<?php

namespace Tests\Feature\System;

use App\Models\Chapter;
use App\Models\Formula;
use App\Models\Theme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GenerateSitemapTest extends TestCase
{
    use RefreshDatabase;

    private function generateSitemap(): string
    {
        $this->artisan('sitemap:generate')->assertSuccessful();

        return file_get_contents(public_path('sitemap.xml'));
    }

    public function test_sitemap_lists_the_formula_index_but_not_individual_formulas(): void
    {
        // Une formule rattachée à un chapitre : son URL /formulaire/{id} redirige,
        // elle ne doit donc jamais figurer dans le sitemap.
        $formula = Formula::factory()->create();

        $xml = $this->generateSitemap();

        $this->assertStringContainsString(route('formulas.index'), $xml);
        $this->assertStringNotContainsString(route('formulas.show', $formula), $xml);
    }

    public function test_sitemap_contains_the_canonical_chapter_url(): void
    {
        $theme = Theme::factory()->create(['enabled' => true]);
        $chapter = Chapter::factory()->create(['theme_id' => $theme->id, 'active' => true]);

        $xml = $this->generateSitemap();

        $this->assertStringContainsString(
            route('themes.chapters.show', [$theme->slug, $chapter->slug]),
            $xml
        );
    }
}
