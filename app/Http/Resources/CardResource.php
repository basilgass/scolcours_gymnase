<?php

namespace App\Http\Resources;

use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Card
 */
class CardResource extends JsonResource
{
	// No wrap around the data.
	public static $wrap = null;

	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */

	//TODO: Handle the one side card only !
	public function toArray(Request $request): array
	{
		$blocks = $this->blocks;

		return [
			"id" => $this->id,

			"recto" => $this->hasBlocks() ? BlockResource::make($blocks[0]) : null,
			"verso" => $this->hasBlocks() ? BlockResource::make($blocks[1]) : null,

			"reference" => $this->hasReference() ? [
				"block"    => $this->reference_block,
				"splitter" => $this->reference_block_splitter
			] : null,

			//			"user" => $this->userScores(),
		];
	}
}
