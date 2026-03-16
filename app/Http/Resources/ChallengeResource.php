<?php

namespace App\Http\Resources;

use App\Models\Challenge;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

/**
 * @mixin Challenge
 */
class ChallengeResource extends JsonResource
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
			...parent::toArray($request),
			'block'      => $this->blocks[0],
			'chapter'    => ChapterResource::make($this->chapter),
			"generators" => GeneratorResource::collection($this->generators)
		];
	}
}
