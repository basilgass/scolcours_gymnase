<?php

namespace App\Http\Middleware;

use App\Http\Resources\UserResource;
use App\Models\Theme;
use App\Support\ThemeResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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

	private function resolvePageMeta(Request $request): array
	{
		$parameters = $request->route()?->parameters() ?? [];
		$priority = ['chapter', 'challenge', 'generator', 'deck', 'evaluation', 'post', 'quizz', 'tool', 'course'];

		foreach ($priority as $key) {
			$model = $parameters[$key] ?? null;
			if ($model && method_exists($model, 'getAttribute')) {
				$title = $model->meta_title ?? $model->title ?? null;
				if ($title) {
					return ['title' => $title];
				}
			}
		}

		return ['title' => null];
	}
}
