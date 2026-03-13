<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\QuizzResource;
use App\Http\Resources\QuizzSessionResource;
use App\Http\Resources\ThemeResource;
use App\Models\Quizz;
use App\Models\Team;
use Inertia\Inertia;
use Inertia\Response;

class QuizzController extends Controller
{
	// only available as admin.
	public function index()
	{

		$quizz = Quizz::all();

		$quizz->load([
			'questions', 'sessions' => function ($query) {
				$query->where('index', 0);
			}
		]);

		return Inertia::render('Quizzs/admin/AdminQuizz',
			[
				"quizzs" => QuizzResource::collection($quizz)
			]
		);
	}

	public function edit(Quizz $quizz): Response
	{

		$quizz->load('chapter', 'blocks');

		$data = [
			"quizz"     => QuizzResource::make($quizz),
			"questions" => QuestionResource::collection($quizz->questions),
			"sessions"  => QuizzSessionResource::collection($quizz->sessions),
			"teams"     => Team::active()->get(),
		];

		// Add the theme to the main layout page
		if ($quizz->chapter) {
			$data["theme"] = ThemeResource::make($quizz->chapter->theme);
		}
		return Inertia::render(
			'Quizzs/QuizzEdit',
			$data
		);

	}


}
