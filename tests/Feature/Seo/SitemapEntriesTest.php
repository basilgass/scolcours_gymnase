<?php

namespace Tests\Feature\Seo;

use App\Models\Chapter;
use App\Models\Theme;
use App\Models\Tool;
use App\Services\Seo\SitemapEntries;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapEntriesTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_home_index_and_public_models(): void
    {
        $theme = Theme::factory()->create(['enabled' => true]);
        $chapter = Chapter::factory()->create(['theme_id' => $theme->id, 'active' => true]);
        $tool = Tool::factory()->create();

        $urls = app(SitemapEntries::class)->all()->pluck('url');

        $this->assertTrue($urls->contains(url('/')));
        $this->assertTrue($urls->contains(route('formulas.index')));
        $this->assertTrue($urls->contains(route('themes.show', $theme->slug)));
        $this->assertTrue($urls->contains(route('themes.chapters.show', [$theme->slug, $chapter->slug])));
        $this->assertTrue($urls->contains(route('tools.show', $tool->slug)));
    }

    public function test_it_carries_the_model_for_content_entries(): void
    {
        $tool = Tool::factory()->create();

        $entry = app(SitemapEntries::class)->all()
            ->firstWhere('url', route('tools.show', $tool->slug));

        $this->assertNotNull($entry);
        $this->assertTrue($entry->model->is($tool));
        $this->assertSame('tools.show', $entry->key);
    }
}
