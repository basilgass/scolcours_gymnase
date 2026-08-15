<?php

namespace App\Services\Seo;

use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Generator;
use App\Models\Tool;
use Illuminate\Database\Eloquent\Model;

class MetaResolver
{
    public function resolve(SitemapEntry $entry): MetaData
    {
        if ($entry->model === null) {
            return $this->fromConfig($entry->key);
        }

        return $this->fromModel($entry->model);
    }

    private function fromConfig(string $key): MetaData
    {
        $static = config("seo.static.{$key}", [
            'title'       => config('seo.suffix'),
            'description' => '',
        ]);

        return new MetaData(
            $static['title'],
            DescriptionCleaner::clean($static['description']),
            MetaSource::Template,
        );
    }

    private function fromModel(Model $model): MetaData
    {
        $override = $model->meta;
        $title = $this->title($model, $override?->meta_title);

        if (filled($override?->meta_description)) {
            return new MetaData(
                $title,
                DescriptionCleaner::clean($override->meta_description),
                MetaSource::Override,
            );
        }

        [$description, $source] = $this->deriveDescription($model);

        return new MetaData($title, $description, $source);
    }

    private function title(Model $model, ?string $override): string
    {
        $base = filled($override) ? $override : $model->title;
        $suffix = config('seo.suffix');

        $context = $model instanceof Chapter
            ? $model->theme->title
            : (config('seo.labels')[$model::class] ?? '');

        return $context !== ''
            ? "{$base} — {$context} | {$suffix}"
            : "{$base} | {$suffix}";
    }

    /**
     * @return array{0: string, 1: MetaSource}
     */
    private function deriveDescription(Model $model): array
    {
        if ($model instanceof Chapter || $model instanceof Challenge) {
            $body = $model->blocks->sortBy('order')->first()?->body ?? '';

            return [DescriptionCleaner::clean($body), MetaSource::Block];
        }

        if ($model instanceof Tool || $model instanceof Generator) {
            return [DescriptionCleaner::clean($model->body), MetaSource::Body];
        }

        // Deck, Theme : aucune source de contenu.
        return ['', MetaSource::Template];
    }
}
