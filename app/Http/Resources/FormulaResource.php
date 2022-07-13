<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FormulaResource extends JsonResource
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

		return [
			'id' => $this->id,
			'chapter_id' => $this->chapter_id,
			'order' => $this->order,
			'block' => $this->blocks[0] ?? null
		];
	}
}
