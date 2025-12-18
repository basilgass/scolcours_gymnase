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
		// TODO: Challenge resource must be reworked.
		if (count($this->blocks) === 0) {
			$this->blocks()->create();
		}

		// TODO: challenge generators -> on doit pouvoir récupérer l'id du generatorable, pour supprimer une valeur défnie.
		return [
			...parent::toArray($request),
			'maxLevel'   => $this->generators->count(),
			'block'      => $this->blocks[0],
			'chapter'    => ChapterResource::make($this->chapter),
			"generators" => GeneratorResource::collection($this->generators)
		];
	}
}
