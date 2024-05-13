<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Generator */
class GeneratorResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id'       => $this->id,
			'title'    => $this->title,
			'body'     => $this->body,
			'keyboard' => $this->keyboard,
			'code'     => $this->code,
			'slug'     => $this->slug,
			'template' => $this->template,
			'theme'    => [
				'id'   => $this->theme_id,
				'slug' => $this->theme?->slug,
			],
		];
	}
}
