<?php

namespace App\Http\Resources;

use App\Models\Course;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

/** @mixin Course */
class CourseResource extends JsonResource
{
	protected ?Team $matchingTeam = null;

	public function toArray(Request $request): array
	{
		$lessons = $this->whenLoaded('lessons');
		$scheduledAt = null;

		$user = \Auth::user();
		// Si une équipe est passée, l'utiliser ; sinon, prendre les équipes de l'utilisateur connecté
		$userTeamIds = $this->matchingTeam
			? collect([$this->matchingTeam->id])
			: ($user ? $user->teams->pluck('id') : collect());

		if ($lessons instanceof Collection && $lessons->count() > 0) {
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

	public static function make(...$parameters): static
	{
		$resource = $parameters[0] ?? null;
		$matchingTeam = $parameters[1] ?? null;

		$instance = new static($resource);
		$instance->matchingTeam = $matchingTeam;
		return $instance;
	}
}
