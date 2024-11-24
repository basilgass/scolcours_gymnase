<?php

namespace App\Http\Resources;

use App\Models\Deck;
use App\Models\Theme;
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
        // Get theme from cache
        $theme = isset($this->chapter) ? Theme::getTheme($this->chapter->theme_id) : null;

        // TODO: subgroup of theme is not necessary, as the theme object is always accessible in frontend ???
        return [
            ...parent::toArray($request),
            "theme"     => [
                'id' => $theme?->id,
                'slug' => $theme?->slug,
            ],
            'chapter'   => [
                'id'   => $this->chapter_id,
                'slug' => $this->chapter?->slug
            ],
            "flipcards" => FlipcardResource::collection($this->flipcards)
        ];
    }
}
