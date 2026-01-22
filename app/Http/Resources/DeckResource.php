<?php

namespace App\Http\Resources;

use App\Models\Deck;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Deck
 */
class DeckResource extends JsonResource
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
		return [
			"id"          => $this->id,
			"user_id"     => $this->user_id,
			"title"       => $this->title,
			"slug"        => $this->slug,
			"active"      => $this->active,
			'chapter'     => ChapterResource::make($this->chapter),
			"created_at"  => $this->created_at,
			"updated_at"  => $this->updated_at,
			"cards_count" => $this->cards_count ?? $this->cards?->count(),
			"cards"       => CardResource::collection($this->when(
				$this->relationLoaded('cards'),
				fn() => $this->cards
			) ?? []),
			//			"user"        => $this->userScores(),
		];
	}
}
