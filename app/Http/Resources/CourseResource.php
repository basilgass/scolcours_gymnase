<?php

namespace App\Http\Resources;

use App\Models\Course;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Course */
class CourseResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		$lessons = $this->whenLoaded('lessons');
		$scheduledAt = null;

		$userTeamIds = \Auth::user()->teams->pluck('id');

		if ($lessons && $lessons->count() > 0) {
			$scheduledDates = collect($lessons)
				->flatMap(fn($lesson) => $lesson->calendars->whereIn('team_id', $userTeamIds)->pluck('scheduled_at')
				);
			$now = now();

			if ($scheduledDates->isEmpty() || $scheduledDates->min()->gt($now->copy()->addWeek())) {
				$status = 'not yet started';
			} elseif ($scheduledDates->every(fn($date) => $date && Carbon::parse($date)->lt($now))) {
				$status = 'finished';
				$scheduledAt = $scheduledDates->max();
			} else {
				$status = 'active';
				$scheduledAt = $scheduledDates
					->filter(fn($date) => Carbon::parse($date)->gt($now))
					->sort()
					->first();
			}
		} else {
			$status = 'not yet started';
		}


		return [
			'id'           => $this->id,
			'title'        => $this->title,
			'slug'         => $this->slug,
			'block'        => BlockResource::make($this->blocks[0]),
			'lessons'      => LessonResource::collection($lessons),
			'status'       => $status,
			'scheduled_at' => $scheduledAt ? $scheduledAt->format('Y-m-d H:i:s') : '',
			'theme_id'     => $this->theme_id,
			'teams'        => $this->whenLoaded('teams'),
			'created_at'   => $this->created_at,
			'updated_at'   => $this->updated_at,
		];
	}
}
