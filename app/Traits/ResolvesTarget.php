<?php

namespace App\Traits;

use App\Models\Block;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Deck;
use App\Models\Formula;
use App\Models\Generator;
use App\Models\Lesson;
use App\Models\Post;
use App\Models\Question;

trait ResolvesTarget
{
	protected array $allowedTargets = [
		'block'     => Block::class,
		'post'      => Post::class,
		'question'  => Question::class,
		'formula'   => Formula::class,
		'chapter'   => Chapter::class,
		'lesson'    => Lesson::class,
		'course'    => Course::class,
		'deck'      => Deck::class,
		'challenge' => Challenge::class,
		'generator' => Generator::class,
	];

	protected array $allowedWiths = [
		'questions',
		'blocks',
		'illustrations',
	];

	protected function resolveTarget(array $validated, string $with = null)
	{
		$type = strtolower($validated['target_type']);
		$id = $validated['target_id'];

		if (!array_key_exists($type, $this->allowedTargets)) {
			abort(422, 'Invalid target class: ' . $type);
		}
		if ($with && !in_array($with, $this->allowedWiths, true)) {
			abort(422, 'Invalid relation: ' . $with);
		}

		$class = $this->allowedTargets[$type];
		$query = $class::query();

		if ($with) {
			$query->with($with); // à sécuriser aussi si nécessaire
		}

		return $query->findOrFail($id);
	}

}
