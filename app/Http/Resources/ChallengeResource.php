<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChallengeResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
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
			'chapter' => ChapterResource::make($this->chapter, true)
		];
	}
}
