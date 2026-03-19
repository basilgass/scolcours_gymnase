<?php

namespace App\Http\Resources;

use App\Models\Generator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Generator */
class GeneratorResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id'       => $this->id,
			'slug'     => $this->slug,
			'title'    => $this->title,
			'theme_id' => $this->theme_id,
			'body'     => $this->body,
			'template' => $this->template,
			'keyboard' => $this->keyboard,
			'code'     => $this->code,
			'order'    => $this->pivot?->order,
			'config'   => $this->pivot?->config ? json_decode($this->pivot->config, true) : null,
		];
	}
}
