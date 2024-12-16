<?php

namespace App\Http\Resources;

use App\Models\Chapter;
use App\Models\Theme;
use Carbon\Carbon;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

/**
 * @mixin Chapter
 */
class ChapterResource extends JsonResource
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
		$theme = Theme::getTheme($this->theme_id);

		return [
			'id' => $this->id,
			'slug' => $this->slug,
			'title' => $this->title,
			'meta_title' => $this->meta_title,
			'theme' => [
				'id' => $theme->id,
				'slug' => $theme->slug
			],
			'block' =>  BlockResource::make($this->blocks[0]),
			'active' => $this->active,
			'url' => $this->url,
			'updated_at' => Carbon::parse($this->updated_at)->format('Y-m-d H:i'),
			'modified' => isset($this->latest_block_updated_at) ?
				Carbon::make($this->latest_block_updated_at)->diffForHumans():
				$this->updated_at->diffForHumans()
		];
	}
}
