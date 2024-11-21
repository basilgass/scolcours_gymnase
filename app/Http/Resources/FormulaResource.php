<?php

namespace App\Http\Resources;

use App\Models\Formula;
use App\Models\Theme;
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
        $theme = Theme::getTheme($this->theme_id);

		return [
			'id' => $this->id,
            'theme' => $theme,
			'order' => $this->blocks[0]->order,
			'block' => BlockResource::make($this->blocks[0])
		];
	}
}
