<?php

namespace App\Http\Middleware;

use App\Http\Resources\UserResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Deck;
use App\Models\Generator;
use App\Models\Theme;
use App\Models\Tool;
use App\Services\Seo\MetaResolver;
use App\Services\Seo\SitemapEntry;
use App\Support\ThemeResolver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Routing\Route;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
	/**
	 * The root template that is loaded on the first page visit.
	 *
	 * @var string
	 */
	protected $rootView = 'app';

	/**
	 * Determine the current asset version.
	 *
	 * @param Request $request
	 * @return string|null
	 */
	public function version(Request $request): ?string
	{
		return parent::version($request);
	}

	/**
	 * Define the props that are shared by default.
	 *
	 * @param Request $request
	 * @return array
	 */
	public function share(Request $request): array
	{
		$user = null;

		if ($request->user()) {
			$user = UserResource::make($request->user());
		}

		return array_merge(parent::share($request), [
			'auth'      => [
				'user' => $user,
				'can'  => [
					'admin' => $request->user()?->admin
				]
			],
			'scolcours' => collect(Cache::get('scolcours'))->toArray(),
			'theme'     => ThemeResolver::resolve(),
			'themes'    => Theme::getThemesFromCache()
			                    ->mapWithKeys(function ($item, $key) {
				                    return [
					                    $item->id => [
						                    'id'      => $item->id,
						                    'slug'    => $item->slug,
						                    'title'   => $item->title,
						                    'icon'    => $item->icon,
						                    'enabled' => $item->enabled
					                    ]
				                    ];
			                    }),
			'meta'      => $this->resolvePageMeta($request),
		]);
	}

	/**
	 * Méta SEO résolues (titre + description) pour la page courante, injectées
	 * côté serveur dans le <head> (cf. app.blade.php) puisqu'on est en Inertia
	 * sans SSR. Les 6 types SEO passent par le MetaResolver complet ; les autres
	 * modèles liés gardent un titre simple ; les pages sans modèle lisent la
	 * config statique.
	 *
	 * @return array{title: string, description: string}
	 */
	private function resolvePageMeta(Request $request): array
	{
		$route = $request->route();
		$suffix = config('seo.suffix', config('app.name', 'Scolcours'));
		$model = $route instanceof Route ? $this->boundModel($route) : null;

		if ($model !== null && $this->isSeoModel($model)) {
			$model->loadMissing($this->metaRelationsFor($model));
			$meta = app(MetaResolver::class)->resolve(
				new SitemapEntry($request->url(), $route?->getName() ?? '', $model)
			);

			return ['title' => $meta->title, 'description' => $meta->description];
		}

		// Autre modèle lié (Post, Quizz, Evaluation, Course...) : on préserve son
		// titre d'onglet, sans description (hors périmètre SEO du sitemap).
		if ($model !== null && filled($model->title ?? null)) {
			return ['title' => "{$model->title} | {$suffix}", 'description' => ''];
		}

		// Page sans modèle : titre/description depuis config/seo.php via le resolver.
		$meta = app(MetaResolver::class)->resolve(
			new SitemapEntry($request->url(), $route?->getName() ?? 'home', null)
		);

		return ['title' => $meta->title, 'description' => $meta->description];
	}

	/**
	 * Routes SEO dont le paramètre est une string (liaison manuelle par slug côté
	 * contrôleur, pas de model binding implicite) : nom de route => classe.
	 *
	 * @var array<string, class-string<Model>>
	 */
	private const SLUG_BOUND_ROUTES = [
		'tools.show'      => Tool::class,
		'decks.show'      => Deck::class,
		'challenges.show' => Challenge::class,
		'generators.show' => Generator::class,
	];

	/**
	 * Modèle lié à la route courante. Deux étages : d'abord un modèle déjà résolu
	 * par model binding implicite (le contenu prime sur son thème : une page
	 * chapitre lie theme + chapter, on veut le chapter) ; sinon, résolution par
	 * slug pour les routes à liaison-string (ex. `tools.show`).
	 */
	private function boundModel(Route $route): ?Model
	{
		$priority = ['chapter', 'challenge', 'generator', 'deck', 'tool', 'theme', 'evaluation', 'post', 'quizz', 'course'];
		$parameters = $route->parameters();

		foreach ($priority as $key) {
			if (($parameters[$key] ?? null) instanceof Model) {
				return $parameters[$key];
			}
		}

		$modelClass = self::SLUG_BOUND_ROUTES[$route->getName()] ?? null;
		if ($modelClass !== null) {
			$slug = $route->parameters()[array_key_first($route->parameters())] ?? null;

			return is_string($slug) ? $modelClass::where('slug', $slug)->first() : null;
		}

		return null;
	}

	private function isSeoModel(Model $model): bool
	{
		return $model instanceof Chapter
			|| $model instanceof Theme
			|| $model instanceof Tool
			|| $model instanceof Deck
			|| $model instanceof Challenge
			|| $model instanceof Generator;
	}

	/**
	 * @return array<int, string>
	 */
	private function metaRelationsFor(Model $model): array
	{
		return match (true) {
			$model instanceof Chapter                             => ['theme', 'blocks', 'meta'],
			$model instanceof Challenge                           => ['blocks', 'meta'],
			default                                               => ['meta'],
		};
	}
}
