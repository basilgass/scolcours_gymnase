<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
      ...parent::toArray($request),
      "theme" => [
        "id" => $this->chapter?->theme->id,
        "slug" => $this->chapter?->theme->slug
      ],
      'chapter'       => [
        'id'   => $this->chapter_id,
        'slug' => $this->chapter?->slug
      ],
      "flipcards" => FlipcardResource::collection($this->flipcards)
    ];
  }
}
