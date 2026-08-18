<?php

namespace Tests\Feature\Seo;

use App\Models\Chapter;
use App\Models\Theme;
use App\Models\Tool;
use App\Services\Seo\SitemapEntries;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
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

    public function test_it_never_yields_duplicate_urls(): void
    {
        // Un thème-skin dont le slug collisionne avec une route d'index (ici « tools »
        // → /tools, comme `tools.index`) ne doit pas produire une seconde entrée.
        Theme::factory()->create(['enabled' => true, 'slug' => 'tools']);

        $urls = app(SitemapEntries::class)->all()->pluck('url');

        $this->assertSame($urls->unique()->count(), $urls->count());
        $this->assertSame(1, $urls->filter(fn (string $url) => $url === route('tools.index'))->count());
    }

    public function test_it_excludes_the_broken_posts_index_url(): void
    {
        // /posts n'a plus de route (PostController@index inexistant) : ni au
        // sitemap ni à l'audit. On teste l'URL brute, le nom de route n'existant plus.
        $urls = app(SitemapEntries::class)->all()->pluck('url');

        $this->assertFalse($urls->contains(url('/posts')));
    }

    public function test_it_only_lists_themes_reachable_via_the_route_cache(): void
    {
        // Route::bind('theme') résout depuis getThemesFromCache : un thème enabled
        // en DB mais absent du cache (seed brut sans event Eloquent) est injoignable
        // (abort 404). Le sitemap doit donc suivre le cache, pas la DB brute.
        $cached = Theme::factory()->create(['enabled' => true]); // event saved → entre au cache

        $ghost = Theme::factory()->make(['slug' => 'ghost-theme', 'enabled' => true]);
        DB::table('themes')->insert(array_merge($ghost->getAttributes(), [
            'created_at' => now(),
            'updated_at' => now(),
        ]));

        $urls = app(SitemapEntries::class)->all()->pluck('url');

        $this->assertTrue($urls->contains(route('themes.show', $cached->slug)));
        $this->assertFalse($urls->contains(url('/ghost-theme')));
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
