<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Deck;
use App\Models\Generator;
use App\Models\Theme;
use App\Models\Tool;
use App\Services\Seo\MetaResolver;
use App\Services\Seo\SitemapEntries;
use App\Services\Seo\SitemapEntry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SeoAdminController extends Controller
{
    /**
     * Modèles porteurs du trait `HasMeta` éditables depuis l'audit.
     * Clé = `class_basename` (ce que l'index expose dans `type`), valeur = FQCN.
     *
     * @var array<string, class-string<Model>>
     */
    private const EDITABLE_MODELS = [
        'Theme'     => Theme::class,
        'Chapter'   => Chapter::class,
        'Tool'      => Tool::class,
        'Deck'      => Deck::class,
        'Challenge' => Challenge::class,
        'Generator' => Generator::class,
    ];

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
                'url'                  => $entry->url,
                'title'                => $meta->title,
                'description'          => $meta->description,
                'type'                 => $entry->model ? class_basename($entry->model) : 'static',
                'metable_id'           => $entry->model?->getKey(),
                'override_title'       => $entry->model?->meta?->meta_title,
                'override_description' => $entry->model?->meta?->meta_description,
                'source'               => $meta->source->value,
                'length'               => mb_strlen($meta->description),
            ];
        })->values();

        return Inertia::render('Admin/AdminSeo', [
            'rows' => $rows,
        ]);
    }

    /**
     * Crée, met à jour ou supprime l'override SEO d'un modèle.
     *
     * Upsert idempotent via `updateOrCreate` ; effacer les deux champs supprime
     * la ligne `metas` et laisse la dérivation (block/body/template) reprendre.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type'             => ['required', 'string', Rule::in(array_keys(self::EDITABLE_MODELS))],
            'id'               => ['required', 'integer'],
            'meta_title'       => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
        ]);

        $modelClass = self::EDITABLE_MODELS[$validated['type']];
        $model = $modelClass::findOrFail($validated['id']);

        $title = $this->nullIfBlank($validated['meta_title'] ?? null);
        $description = $this->nullIfBlank($validated['meta_description'] ?? null);

        if ($title === null && $description === null) {
            $model->meta()->delete();
        } else {
            $model->meta()->updateOrCreate([], [
                'meta_title'       => $title,
                'meta_description' => $description,
            ]);
        }

        $model->load($this->relationsFor($model));
        $meta = $this->resolver->resolve(new SitemapEntry('', '', $model));

        return response()->json([
            'title'                => $meta->title,
            'description'          => $meta->description,
            'source'               => $meta->source->value,
            'length'               => mb_strlen($meta->description),
            'override_title'       => $model->meta?->meta_title,
            'override_description' => $model->meta?->meta_description,
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

    private function nullIfBlank(?string $value): ?string
    {
        $trimmed = trim((string) $value);

        return $trimmed === '' ? null : $trimmed;
    }
}
