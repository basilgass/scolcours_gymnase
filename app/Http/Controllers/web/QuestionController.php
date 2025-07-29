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
		return redirect()->route(
			'themes.chapters.posts.anchor',
			[
				'theme'   => $question->questionable->chapter->theme->slug,
				'chapter' => $question->questionable->chapter->slug,
				'order'   => $question->questionable->order,
				'type'    => 'question',
				'id'      => $question->id
			]
		);

	}

	public function edit(Question $question): Response
	{
		return Inertia::render("Questions/QuestionEdit", [
			'theme'    => $question->questionable->chapter->theme,
			'question' => QuestionResource::make($question)
		]);
	}
}
