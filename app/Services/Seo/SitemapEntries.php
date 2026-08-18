<?php

namespace App\Services\Seo;

use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Deck;
use App\Models\Generator;
use App\Models\Theme;
use App\Models\Tool;
use Illuminate\Support\Collection;

class SitemapEntries
{
    private const INDEX_ROUTES = [
        'formulas.index',
        'tools.index',
        'decks.index',
        'challenges.index',
        'generators.index',
        // Ni 'chapters.index' (/chapters nu = liste vide, route supprimée ; le
        // listing = themes.show) ni 'posts.index' (/posts = 500, route supprimée) :
        // ces URLs n'existent plus, le listing des chapitres passe par les thèmes.
    ];

    /**
     * @return Collection<int, SitemapEntry>
     */
    public function all(): Collection
    {
        $entries = collect([new SitemapEntry(url('/'), 'home')]);

        foreach (self::INDEX_ROUTES as $name) {
            $entries->push(new SitemapEntry(route($name), $name));
        }

        // On énumère les thèmes depuis le MÊME cache que le routing
        // (`Route::bind('theme')` résout via `getThemesFromCache`). Requêter la DB
        // en parallèle divergerait : un thème enabled en DB mais absent du cache
        // (seed brut sans event) `abort(404)` au routing → URL fantôme au sitemap.
        Theme::getThemesFromCache()
            ->each(function (Theme $theme) use ($entries) {
                $entries->push(new SitemapEntry(route('themes.show', $theme->slug), 'themes.show', $theme));

                $theme->chapters()->where('active', true)->get()->each(fn (Chapter $chapter) => $entries->push(
                    new SitemapEntry(
                        route('themes.chapters.show', [$theme->slug, $chapter->slug]),
                        'themes.chapters.show',
                        $chapter
                    )
                ));
            });

        Tool::all()->each(fn (Tool $tool) => $entries->push(
            new SitemapEntry(route('tools.show', $tool->slug), 'tools.show', $tool)
        ));

        Deck::where('active', true)->get()->each(fn (Deck $deck) => $entries->push(
            new SitemapEntry(route('decks.show', $deck->slug), 'decks.show', $deck)
        ));

        Challenge::where('active', true)->get()->each(fn (Challenge $challenge) => $entries->push(
            new SitemapEntry(route('challenges.show', $challenge->slug), 'challenges.show', $challenge)
        ));

        Generator::all()->each(fn (Generator $generator) => $entries->push(
            new SitemapEntry(route('generators.show', $generator->slug), 'generators.show', $generator)
        ));

        // Une URL revendiquée par une route explicite l'emporte : les routes d'accueil
        // et d'index sont énumérées en premier, donc `unique` (qui garde la 1re
        // occurrence) écarte un thème dont le slug collisionne avec une route réservée
        // (ex. un thème-skin de slug « tools » masquerait `tools.index` → /tools).
        return $entries->unique(fn (SitemapEntry $entry) => $entry->url)->values();
    }
}
