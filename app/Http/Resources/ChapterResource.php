<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChapterResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
	 */
	public function toArray($request)
	{
		if (count($this->blocks) === 0) {
			$this->blocks()->create();
			$this->blocks;
		}

		return [
			'id' => $this->id,
			'slug' => $this->slug,
			'title' => $this->title,
			'block' => $this->blocks[0],
			'active' => $this->active,
			'updated_at' => $this->updated_at,
			'posts' => PostResource::collection($this->posts),
			'formulas' => FormulaResource::collection($this->formulas),
			'challenges' => ChallengeResource::collection($this->challenges)
		];
	}
}
