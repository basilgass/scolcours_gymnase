<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class ChapterShowResource extends JsonResource
{
	// No wrap around the data.
	public static $wrap = null;
	/**
	 * Transform the resource into an array.
	 *
	 * @param Request $request
	 * @return array|Arrayable|JsonSerializable
	 */
	public function toArray($request)
	{
		return [
			'id' => $this->id,
			'theme_id'=>$this->theme->id,
			'slug' => $this->slug,
			'title' => $this->title,
			'active' => $this->active,
			'block' => BlockResource::make($this->blocks[0]),
		];
	}
}
