<?php

namespace App\Http\Resources;

use App\Models\Lesson;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Lesson */
class LessonResource extends JsonResource
{
	protected ?Team $matchingTeam = null;

	public static function make(...$parameters): static
	{
		$resource = $parameters[0] ?? null;
		$matchingTeam = $parameters[1] ?? null;

		$instance = new static($resource);
		$instance->matchingTeam = $matchingTeam;
		return $instance;
	}

	public static function collection(...$parameters): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
	{
		$resource = $parameters[0] ?? null;
		$matchingTeam = $parameters[1] ?? null;

		$collection = parent::collection($resource);

		if (is_iterable($collection->collection)) {
			foreach ($collection->collection as $item) {
				if ($item instanceof static) {
					$item->matchingTeam = $matchingTeam;
				}
			}
		}

		return $collection;
	}

	/**
	 * @throws \Exception
	 */
	public function toArray(Request $request): array
	{
		$calendar = null;
		if (isset($this->calendars)) {
			$calendar = $this->matchingTeam
				? $this->calendars->where('team_id', $this->matchingTeam->id)->first()
				: $this->calendars->first(); // TODO: si pas de team, retourne celui de l'utilsateru
		}

		$scheduled_at = $calendar?->scheduled_at ?? null;;

		return [
			'id'              => $this->id,
			'course_id'       => $this->course_id,
			'requires'        => $this->requires ? array_map('intval', explode(',', $this->requires)) : [],
			'title'           => $this->lessonable->title,
			'lessonable_id'   => (int)$this->lessonable_id,
			'lessonable_type' => class_basename($this->lessonable_type),
			'lessonable_tag'  => $this->lessonable->type ?? null,
			'scoreRules'      => $this->scoreRules,
			'remaining_time'  => $scheduled_at?->diffForHumans(),
			'scheduled_at'    => $scheduled_at,
			'homework'        => $calendar?->homework ?? false,
			'created_at'      => $this->created_at,
			'updated_at'      => $this->updated_at,
		];
	}
}
