<?php

namespace App\Http\Resources;

use App\Models\Formula;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

/**
 * @mixin Formula
 */
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
		// « Le » chapitre = celui du pivot contextuel (formule chargée via $chapter->formulas),
		// sinon le premier chapitre rattaché (liste globale). L'ordre est propre au pivot.
		$chapter = $this->pivot
			? ($this->chapters->firstWhere('id', $this->pivot->chapter_id) ?? $this->chapters->first())
			: $this->chapters->first();

		return [
			'id'       => $this->id,
			'theme_id' => $chapter?->theme_id,
			'chapter'  => $chapter ? [
				"id"    => $chapter->id,
				"slug"  => $chapter->slug,
				"title" => $chapter->title,
			] : null,
			'order'    => $this->pivot?->order ?? $chapter?->pivot?->order,
			'block'    => BlockResource::make($this->blocks[0]),
		];
	}
}
