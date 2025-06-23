<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\QuizzSessionRessource;
use App\Http\Resources\ThemeResource;
use App\Models\Chapter;
use App\Models\Quizz;
use App\Models\QuizzSession;
use App\Models\Team;
use Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizzController extends Controller
{

	public function index()
	{
		// The user is connected.
		// Check if a quizz session is enabled for this user.
		$user = Auth::user();

		if ($user) {
			$quizzSessions = $user->quizz_sessions
				->filter(function ($quizz_session){
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

		return Inertia::render("Quizzs/QuizzHome",
			[
				"quizzSessions" => $quizzSessions
			],

		);
	}




	public function admin()
	{
		return Inertia::render('Quizzs/QuizzAdmin',
			[
				"quizzs" => Quizz::all()
			]
		);
	}

	public function adminQuizz(Quizz $quizz): Response
	{

		$data = [
            "quizz" => $quizz,
            "questions" => QuestionResource::collection($quizz->questions),
            "sessions" => QuizzSessionRessource::collection($quizz->sessions),
            "teams" => Team::all(),
            "chapters" => Chapter::all()->map(function ($chapter) {
				return [
					'id' => $chapter->id,
					'title' => $chapter->title,
					'theme' => $chapter->theme->slug
				];
			}),
		];

		// Add the theme to the main layout page
		if ($quizz->chapter) {
			$data["theme"] = ThemeResource::make($quizz->chapter->theme);
		}
		return Inertia::render('Quizzs/QuizzAdminEdit', $data);

	}


	public function show(QuizzSession $quizzSession): Response|RedirectResponse
	{
		// User must be logged in
		if (!Auth::user()) {
			return redirect()->route('login');
		}

		// Questions list from the current quizz.
		$questions = $quizzSession->quizz->questions;

		// Current question (or null)
		$question = $quizzSession->question;

		// Remove the list of questions.
		$quizzSession->quizz->unsetRelation('questions');

		return Inertia::render('Quizzs/QuizzShow',
			[
                "quizzSession" => $quizzSession,
                "question" => $question === null ? null : QuestionResource::make($question),
                "total" => count($questions)
			]
		);
	}

	public function dashboard(QuizzSession $quizzSession): Response
	{
		return Inertia::render('Quizzs/QuizzDashboard',
			[
				"quizzSession" => QuizzSessionRessource::make($quizzSession),
			]
		);
	}

	public function projection(QuizzSession $quizzSession): Response
	{
		// Get all user answers.
		$usersId = $quizzSession->users->pluck('id');
		$question = $quizzSession->question;
		$answers = [];

		if ($question !== null) {
			// On a une question
			// Recherche de toutes les réponses et filtrer avec les utilisateurs
			$answers = $question->answersFrom($quizzSession->users->pluck('id'));
		}

		return Inertia::render('Quizzs/QuizzProjection',
			[
				"quizzSession" => QuizzSessionRessource::make($quizzSession),
				"results" => $answers,
				"usersCount" => $quizzSession->users->count(),
			]
		);
	}

}
