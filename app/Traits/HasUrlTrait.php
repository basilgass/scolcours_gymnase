<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Str;

trait HasUrlTrait
{
	public function url(): Attribute
	{
		return Attribute::get(function () {
			$className = class_basename($this);
			$routeBaseName = Str::plural(Str::snake($className));
			$routeName = $routeBaseName . '.show';

			return route($routeName, $this);
		});
	}
}
