<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuestionResource;
use App\Http\Resources\QuizzResource;
use App\Http\Resources\QuizzSessionResource;
use App\Http\Resources\ScoreResource;
use App\Models\QuizzSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class QuizzSessionController extends Controller
{
	public function index()
	{
		$user = Auth::user();

		if ($user) {
			$quizzSessions = $user->quizz_sessions
				->filter(function ($quizz_session) {
					return $quizz_session->enable;
				})
				->map(function ($quizz_session) {
					// Load the quizz
					$quizz_session->quizz;
					// Load the chapter
					$quizz_session->quizz->theme;

					return $quizz_session;
				});
		}

		return Inertia::render("Quizzs/QuizzIndex",
			[
				"quizzSessions" => QuizzSessionResource::collection($quizzSessions)
			],

		);
	}

	public function show(QuizzSession $quizzSession): Response|RedirectResponse
	{
		// User must be logged in
		if (!Auth::user()) {
			return redirect()->route('login');
		}

		// Current question (or null)
		$question = $quizzSession->question;

		return Inertia::render('Quizzs/QuizzShow',
			[
				"quizz"        => QuizzResource::make($quizzSession->quizz),
				"quizzSession" => QuizzSessionResource::make($quizzSession),
				"question"     => $question === null ? null : QuestionResource::make($question),
			]
		);
	}

	public function dashboard(QuizzSession $quizzSession): Response
	{
		return Inertia::render('Quizzs/QuizzDashboard',
			[
				"quizzSession" => QuizzSessionResource::make($quizzSession),
			]
		);
	}

	public function projection(QuizzSession $quizzSession): Response
	{
		// Get all user answers.
		$usersId = $quizzSession->users->pluck('id');

		/** @var \App\Models\Question|null $question */
		$question = $quizzSession->question;
		$scores = [];

		if ($question !== null) {
			// On a une question
			// Recherche de toutes les réponses et filtrer avec les utilisateurs

			$scores = $question->scores()->whereIn('user_id', $usersId)->get();
		}

		return Inertia::render('Quizzs/QuizzProjection',
			[
				"quizz"        => QuizzResource::make($quizzSession->quizz),
				"quizzSession" => QuizzSessionResource::make($quizzSession),
				"scores"       => ScoreResource::collection($scores),
				"usersCount"   => $quizzSession->users->count(),
			]
		);
	}


}
