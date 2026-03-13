<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use App\Traits\ResolvesTarget;
use Inertia\Inertia;
use Inertia\Response;
use function redirect;

class QuestionController extends Controller
{
	use ResolvesTarget;

	public function show(Question $question)
	{
		// Go to the question.
		$target = $question->questionable;

		if (class_basename($target) === 'Post') {
			return redirect()->route(
				'themes.chapters.posts.anchor',
				[
					'theme'   => $target->chapter->theme->slug,
					'chapter' => $target->chapter->slug,
					'order'   => $target->order,
					'type'    => 'question',
					'id'      => $question->id
				]
			);
		}

		if (class_basename($target) === 'Quizz') {
			return redirect()->route(
				'admin.quizzes.edit',
				[
					"quizz" => $target->id
				]
			);
		}

		if (class_basename($target) === 'Evaluation') {
			return redirect()->route(
				'admin.evaluations.edit',
				[
					"evaluation" => $target->id
				]
			);
		}
	}

	public function edit(Question $question): Response
	{
		return Inertia::render("Questions/QuestionEdit", [
			'theme'    => $question->questionable->chapter?->theme ?? null,
			'question' => QuestionResource::make($question)
		]);
	}
}
