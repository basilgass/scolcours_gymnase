<?php

namespace App\Http\Resources;

use App\Models\Illustration;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Illustration */
class IllustrationResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id'         => $this->id,
			'block_id'  => $this->block_id,
			'order'      => $this->order,
			'title'      => $this->title,
			'css'        => $this->css,

			'widget_id' => $this->widget_id,
			'widget' => new WidgetResource($this->whenLoaded('widget')),

			'parameters' => $this->parameters ?? '',
			'code'       => $this->code,
		];
	}
}
