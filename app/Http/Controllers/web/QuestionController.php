<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Post;
use App\Models\Question;
use App\Models\Quizz;
use App\Models\Score;
use App\Traits\ResolvesTarget;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
			'question' => QuestionResource::make($question)
		]);
	}
}
