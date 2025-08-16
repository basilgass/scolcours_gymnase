<?php

namespace App\Http\Resources;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Course */
class CourseResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id'         => $this->id,
			'title'      => $this->title,
			'slug'       => $this->slug,
			'block'      => BlockResource::make($this->blocks[0]),
			'lessons'    => LessonResource::collection($this->whenLoaded('lessons')),
			'theme_id'   => $this->theme_id,
			'teams'      => $this->whenLoaded('teams'),
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}
