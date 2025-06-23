<?php

namespace App\Traits;

use App\Models\Block;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Formula;
use App\Models\Lesson;
use App\Models\Post;
use App\Models\Question;

trait ResolvesTarget
{
	protected array $allowedTargets = [
		'block'    => Block::class,
		'post'     => Post::class,
		'question' => Question::class,
		'formula'  => Formula::class,
		'chapter'  => Chapter::class,
		'lesson'   => Lesson::class,
		'course'   => Course::class,
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

	protected function resolveTarget2(array $validated, string $with = null)
	{
		$class = 'App\\Models\\' . ucfirst($validated['target_type']);

		if (!class_exists($class)) {
			abort(422, 'Invalid target class: ' . $validated['target_type']);
		}

		if ($with) {
			return $class::with($with)->findOrFail($validated['target_id']);
		} else {
			return $class::findOrFail($validated['target_id']);
		}
	}
}
