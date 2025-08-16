<?php

namespace App\Http\Resources;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Lesson */
class LessonResource extends JsonResource
{
	/**
	 * @throws \Exception
	 */
	public function toArray(Request $request): array
	{
		$scheduled_at = $this->calendars?->first()?->scheduled_at ?? null;

		return [
			'id'              => $this->id,
			'course_id'       => $this->course_id,
			'requires'        => $this->requires ? array_map('intval', explode(',', $this->requires)) : [],
			'title'           => $this->lessonable->title,
			'lessonable_id'   => (int)$this->lessonable_id,
			'lessonable_type' => class_basename($this->lessonable_type),
			'scoreRules'      => $this->scoreRules,
			'remaining_time'  => $scheduled_at?->diffForHumans(),
			'scheduled_at'    => $scheduled_at,
			'created_at'      => $this->created_at,
			'updated_at'      => $this->updated_at,
		];
	}


}
