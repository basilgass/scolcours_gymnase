<?php

namespace App\Http\Middleware;

use App\Models\Theme;
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
	public function version(Request $request)
	{
		return parent::version($request);
	}

	/**
	 * Define the props that are shared by default.
	 *
	 * @param Request $request
	 * @return array
	 */
	public function share(Request $request)
	{
		return array_merge(parent::share($request), [
			'auth' => [
				'user' => $request->user(),
				'can' => [
					'admin' => $request->user()?->admin
				]
			],
			'scolcours' => Cache::get('scolcours')->toArray(),
			'themes' => Theme::where("enabled", "=", 1)
				->orderBy('order')
				->get()
				->mapWithKeys(function ($item, $key) {
				return [
					$key => [
						'id' => $item->id,
						'slug' => $item->slug,
						'title' => $item->title,
						'icon' => $item->icon,
						'enabled'=>$item->enabled
					]
				];
			})
		]);
	}
}
