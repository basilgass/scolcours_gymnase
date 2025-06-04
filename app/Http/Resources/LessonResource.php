<?php

namespace App\Http\Resources;

use App\Models\Challenge;
use App\Models\Deck;
use App\Models\Lesson;
use App\Models\Post;
use App\Models\Quizz;
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
		return [
			'id'         => $this->id,
			'course_id'  => $this->course_id,
			'requires'   => $this->requires ? array_map('intval', explode(',', $this->requires)) : [],
			'calendar'   => [
				'opened_at'      => $this->opened_at,
				'scheduled_at'  => $this->scheduled_at,
				'remaining_days' => $this->remainingDays,
				'diffForHumans'  => $this->scheduled_at->diffForHumans(),
				'is_opened'      => optional($this->opened_at)->isPast(),
			],
			'title'      => $this->lessonable->title,
			// TODO: DOit manager les modèles différents
			'lessonable' => $this->resolveLessonableResource(),
			'lessonable_type' => class_basename($this->lessonable_type),
			'parameters' => $this->parameters,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}

	protected function resolveLessonableResource(): ?JsonResource
	{
		$map = [
			Post::class => PostShowResource::class,
			Challenge::class => ChallengeResource::class,
			// TODO: vérifier que les resources quizz et deck fonctionnent.
			Quizz::class => QuizzSessionRessource::class,
			Deck::class => UserDeckResource::class,
		];

		$class = get_class($this->lessonable);

		if (!isset($map[$class])) {
			return null;
		}

		return new $map[$class]($this->lessonable);
	}
}
