<?php

namespace App\Http\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class ChapterResource extends JsonResource
{
	public function __construct($resource, bool $withLinks = false)
	{
		parent::__construct($resource);
		$this->withLinks = $withLinks;
	}

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

		$withLinks = $this->withLinks;
		return [
			'id' => $this->id,
			'slug' => $this->slug,
			'title' => $this->title,
			'block' => BlockResource::make($this->blocks[0]),
			'active' => $this->active,
			'updated_at' => $this->updated_at,
			'posts' => $this->posts->mapWithKeys(function ($item, $key) use ($withLinks) {
				if ($withLinks) {
					return [$item['order'] => [
						"id" => $item['id'],
						"title" => $item["title"],
						"type" => $item["type"],
						"url" => route('theme.chapter.slide', [$this->theme, $this, $item['order']])
					]];
				}
				return [$item['order'] => [
					"id" => $item['id'],
					"title" => $item["title"],
					"type" => $item["type"],
				]];
			}),
			'formulas' => $this->formulas->pluck('id'),
			'challenges' => $this->challenges->map(
				function ($challenge) {
					return [
						"id" => $challenge["id"],
						"slug" => $challenge["slug"],
						"title" => $challenge["title"]
					];
				}),
//			'posts' => PostResource::collection($this->posts),
//			'formulas' => FormulaResource::collection($this->formulas),
//			'challenges' => ChallengeResource::collection($this->challenges)
		];
	}
}
