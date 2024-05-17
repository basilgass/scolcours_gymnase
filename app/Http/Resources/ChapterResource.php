<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

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
		// The chapter must have a default block (for the title / preview / ...)
		if (count($this->blocks) === 0) {
			$this->blocks()->create();
			$this->blocks;
		}

		// Filter the posts:
		// if admin, show all posts.
		// if not, show only active posts.
		$posts = $this->posts;

		if (!auth()->user()?->admin) {
			$posts = $posts->where('active', true);
		}

		return [
			'id'         => $this->id,
			'slug'       => $this->slug,
			'title'      => $this->title,
			'theme'      => [
				'id'   => $this->theme->id,
				'slug' => $this->theme->slug
			],
			'meta_title' => $this->meta_title,
			'block'      => BlockResource::make($this->blocks[ 0 ]),
			'active'     => $this->active,
			'updated_at' => Carbon::parse($this->updated_at)->format('Y-m-d H:i'),
			'posts'      => PostResource::collection($posts),
			'challenges' => $this->challenges->map(
				function ($challenge) {
					return [
						"id"    => $challenge[ "id" ],
						"slug"  => $challenge[ "slug" ],
						"title" => $challenge[ "title" ]
					];
				}),
			'relations'  => $this->relations
				->map(
					function ($related) {
						return [
							"id"    => $related[ "id" ],
							"slug"  => $related[ "slug" ],
							"title" => $related[ "title" ],
							"theme" => [
								'id' => $related[ "theme_id" ],
								'slug' => null
							],
						];
					}
				)->sortBy(['theme_id', 'title'])->all(),
		];
	}
}
