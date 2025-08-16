<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Route;
use Str;

trait HasUrlTrait
{
	public function url(): Attribute
	{
		return Attribute::get(function () {
			$className = class_basename($this);
			$routeBaseName = Str::plural(Str::snake($className));

			$prefixes = ['student.', 'admin.', ''];

			foreach ($prefixes as $prefix) {
				$routeName = $prefix . $routeBaseName . '.show';
				if (Route::has($routeName)) {
					return route($routeName, $this);
				}
			}
			return null;
		});
	}
}
