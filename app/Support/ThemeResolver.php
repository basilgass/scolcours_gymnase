<?php

namespace App\Support;

use App\Http\Resources\ThemeResource;
use Illuminate\Support\Facades\Route;

class ThemeResolver
{
	/**
	 * Résout dynamiquement le thème depuis le modèle injecté dans la route.
	 */
	public static function resolve(): ?ThemeResource
	{
		$route = Route::current();

		if (!$route) {
			return null;
		}

		foreach ($route->parameters() as $param) {
			if (!is_object($param)) {
				continue;
			}

			// Si le modèle a une relation theme
			if (method_exists($param, 'theme')) {
				$theme = $param->relationLoaded('theme')
					? $param->theme
					: $param->theme()->first();

				if ($theme) {
					return ThemeResource::make($theme);
				}
			}
		}

		return null;
	}
}
