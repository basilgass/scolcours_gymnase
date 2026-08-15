<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Services\Seo\MetaResolver;
use App\Services\Seo\SitemapEntries;
use App\Services\Seo\SitemapEntry;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;
use Inertia\Response;

class SeoAdminController extends Controller
{
    public function __construct(
        private readonly SitemapEntries $entries,
        private readonly MetaResolver $resolver,
    ) {}

    public function index(): Response
    {
        $rows = $this->entries->all()->map(function (SitemapEntry $entry) {
            $entry->model?->loadMissing($this->relationsFor($entry->model));

            $meta = $this->resolver->resolve($entry);

            return [
                'url'         => $entry->url,
                'title'       => $meta->title,
                'description' => $meta->description,
                'source'      => $meta->source->value,
                'length'      => mb_strlen($meta->description),
            ];
        })->values();

        return Inertia::render('Admin/AdminSeo', [
            'rows' => $rows,
        ]);
    }

    /**
     * @return array<int, string>
     */
    private function relationsFor(Model $model): array
    {
        return match (true) {
            $model instanceof Chapter => ['theme', 'blocks', 'meta'],
            default                   => ['meta'],
        };
    }
}
