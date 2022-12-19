<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class ChallengeResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @param Request $request
	 * @return array|Arrayable|JsonSerializable
	 */
	public function toArray($request)
	{
//        return parent::toArray($request);
		if (count($this->blocks) === 0) {
			$this->blocks()->create();
			$this->blocks;
		}

		return [
			...parent::toArray($request),
			'block' => $this->blocks[0],
			'chapter' => ChapterMinResource::make($this->chapter)
		];
	}
}
