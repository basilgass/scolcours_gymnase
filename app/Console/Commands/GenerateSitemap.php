<?php

namespace App\Console\Commands;

use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Deck;
use App\Models\Formula;
use App\Models\Generator;
use App\Models\Theme;
use App\Models\Tool;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

#[Signature('sitemap:generate')]
#[Description('Génère le fichier public/sitemap.xml à partir du contenu publié.')]
class GenerateSitemap extends Command
{
    public function handle(): int
    {
        $sitemap = Sitemap::create();

        $sitemap->add(
            Url::create('/')
                ->setPriority(1.0)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
        );

        $indexRoutes = [
            'formulas.index',
            'tools.index',
            'decks.index',
            'challenges.index',
            'generators.index',
            'chapters.index',
            'posts.index',
        ];
        foreach ($indexRoutes as $name) {
            $sitemap->add(
                Url::create(route($name))
                    ->setPriority(0.5)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
            );
        }

        Theme::where('enabled', true)
            ->with(['chapters' => fn ($q) => $q->where('active', true)])
            ->get()
            ->each(function (Theme $theme) use ($sitemap) {
                $sitemap->add(
                    Url::create(route('themes.show', $theme->slug))
                        ->setLastModificationDate($theme->updated_at)
                        ->setPriority(0.7)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                );

                $theme->chapters->each(fn (Chapter $chapter) => $sitemap->add(
                    Url::create(route('themes.chapters.show', [$theme->slug, $chapter->slug]))
                        ->setLastModificationDate($chapter->updated_at)
                        ->setPriority(1.0)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ));
            });

        Formula::whereHas('chapter', fn ($q) => $q->where('active', true))
            ->get()
            ->each(fn (Formula $formula) => $sitemap->add(
                Url::create(route('formulas.show', $formula->id))
                    ->setLastModificationDate($formula->updated_at)
                    ->setPriority(0.6)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
            ));

        Tool::all()->each(fn (Tool $tool) => $sitemap->add(
            Url::create(route('tools.show', $tool->slug))
                ->setLastModificationDate($tool->updated_at)
                ->setPriority(0.6)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
        ));

        Deck::where('active', true)->get()->each(fn (Deck $deck) => $sitemap->add(
            Url::create(route('decks.show', $deck->slug))
                ->setLastModificationDate($deck->updated_at)
                ->setPriority(0.6)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
        ));

        Challenge::where('active', true)->get()->each(fn (Challenge $challenge) => $sitemap->add(
            Url::create(route('challenges.show', $challenge->slug))
                ->setLastModificationDate($challenge->updated_at)
                ->setPriority(0.6)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
        ));

        Generator::all()->each(fn (Generator $generator) => $sitemap->add(
            Url::create(route('generators.show', $generator->slug))
                ->setLastModificationDate($generator->updated_at)
                ->setPriority(0.6)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
        ));

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $count = count($sitemap->getTags());
        $this->info("sitemap.xml généré — {$count} URLs");

        return self::SUCCESS;
    }
}