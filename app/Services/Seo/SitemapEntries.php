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
        'chapters.index',
        'posts.index',
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

        Theme::where('enabled', true)
            ->with(['chapters' => fn ($q) => $q->where('active', true)])
            ->get()
            ->each(function (Theme $theme) use ($entries) {
                $entries->push(new SitemapEntry(route('themes.show', $theme->slug), 'themes.show', $theme));

                $theme->chapters->each(fn (Chapter $chapter) => $entries->push(
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

        return $entries->values();
    }
}
