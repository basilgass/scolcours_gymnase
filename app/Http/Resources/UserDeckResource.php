<?php

namespace App\Http\Resources;

use App\Models\UserDeck;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin UserDeck
 */
class UserDeckResource extends JsonResource
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
		$running = true;
		// Check the cards:
		// If all are null => false
		// If all are 1 => false
		if(
			$this->cards->every(fn($card) => $card->current_score===null)
			or
			$this->cards->every(fn($card) => $card->current_score===1.0)
		){
			$running = false;
		}

		return [
			"id" => $this->id,
			"user_id" => $this->user_id,
			"title" => $this->title,
			"description" => $this->description,
			"running" => $running,
			"created_at" => $this->created_at,
			"updated_at" => $this->updated_at,

			"time_spent" => [
				"total" => $this->cards->sum('time_spent'),
				"min"   => $this->cards->min('time_spent'),
				"max"   => $this->cards->max('time_spent'),
			],

			"count" => [
				"min" => $this->cards->min('appearances'),
				"max" => $this->cards->max('appearances')
			],

			"average"     => $this->cards->filter(fn($card) => $card->appearances > 0)
				->avg(fn($card) => $card->success / $card->appearances),

			"number_of_cards" =>$this->cards->count()
		];
	}
}
