<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class FormulaResource extends JsonResource
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

		$this->blocks;
		return [
			'id' => $this->id,
			'chapter_id' => $this->chapter_id,
			'order' => $this->order,
			'block' => $this->blocks[0] ?? null
		];
	}
}
