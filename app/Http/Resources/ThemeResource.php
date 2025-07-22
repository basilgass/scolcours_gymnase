<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Theme */
class ThemeResource extends JsonResource
{
	public static $wrap = null;

	public function toArray(Request $request): array
	{
		return [
			'id'      => $this->id,
			'slug'    => $this->slug,
			'title'   => $this->title,
			'order'   => $this->order,
			'color'   => $this->color,
			'icon'    => $this->icon,
			'enabled' => $this->enabled,
		];
	}
}
