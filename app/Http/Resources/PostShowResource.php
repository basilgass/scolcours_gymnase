<?php

namespace App\Http\Resources;

use App\Models\Post;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use JsonSerializable;

/**
 * @mixin Post
 */
class PostShowResource extends PostResource
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
		return [
            ...parent::toArray($request),
            'script' => $this->script,
            'switch' => $this->switch,
            'blocks' => BlockResource::collection($this->blocks),
            'questions' => QuestionResource::collection($this->questions),
            'questionsGrid' => $this->questionsGrid
		];
	}
}
