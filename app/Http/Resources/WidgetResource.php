<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Widget */
class WidgetResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id'          => $this->id,
			'name'        => $this->name,
			'slug'        => $this->slug,
			'component'   => $this->component,
			'description' => $this->description,
			'theme'       => [
				'id'   => $this->theme_id,
				'slug' => $this->theme?->slug
			],
			'control'     => $this->control,
		];
	}
}
