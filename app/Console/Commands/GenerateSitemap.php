<?php

namespace App\Console\Commands;

use App\Services\Seo\SitemapEntries;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

#[Signature('sitemap:generate')]
#[Description('Génère le fichier public/sitemap.xml à partir du contenu publié.')]
class GenerateSitemap extends Command
{
    public function handle(SitemapEntries $entries): int
    {
        $sitemap = Sitemap::create();

        foreach ($entries->all() as $entry) {
            $url = Url::create($entry->url)
                ->setPriority($this->priorityFor($entry->key))
                ->setChangeFrequency($this->changeFrequencyFor($entry->key));

            if ($entry->model?->updated_at !== null) {
                $url->setLastModificationDate($entry->model->updated_at);
            }

            $sitemap->add($url);
        }

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $count = count($sitemap->getTags());
        $this->info("sitemap.xml généré — {$count} URLs");

        return self::SUCCESS;
    }

    private function priorityFor(string $key): float
    {
        return match ($key) {
            'home', 'themes.chapters.show' => 1.0,
            'themes.show'                  => 0.7,
            default                        => str_ends_with($key, '.index') ? 0.5 : 0.6,
        };
    }

    private function changeFrequencyFor(string $key): string
    {
        return match ($key) {
            'home', 'themes.show', 'themes.chapters.show' => Url::CHANGE_FREQUENCY_WEEKLY,
            default                                       => Url::CHANGE_FREQUENCY_MONTHLY,
        };
    }
}
