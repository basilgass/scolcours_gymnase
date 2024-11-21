<?php

namespace App\Http\Resources;

use App\Models\Flipcard;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Flipcard
 */
class FlipcardResource extends JsonResource
{
	// No wrap around the data.
	public static $wrap = null;

	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		$blocks = $this->blocks;
		return [
			"id" => $this->id,
			"recto" => BlockResource::make($blocks[0]),
			"verso" => BlockResource::make($blocks[1])
		];
	}
}
