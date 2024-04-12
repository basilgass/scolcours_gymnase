<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class FormulaResource extends JsonResource
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
//        return parent::toArray($request);

//		$this->blocks;
		return [
			'id' => $this->id,
			'chapter' => [
				'id'=> $this->chapter->id,
				'title'=> $this->chapter->title,
				'theme_id'=> $this->chapter->theme_id,
			],
			'order' => $this->order,
			'block' => BlockResource::make($this->blocks[0])
		];
	}
}
