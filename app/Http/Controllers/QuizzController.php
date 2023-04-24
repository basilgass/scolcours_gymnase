<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuestionResource;
use App\Http\Resources\QuizzSessionRessource;
use App\Models\Quizz;
use App\Models\QuizzSession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizzController extends Controller
{

	public function index()
	{
		return Quizz::all();
	}

	public function show(QuizzSession $quizzSession)
	{
		// User must be logged in
		if(!\Auth::user()){
			return redirect()->route('home');
		}

		// Questions list from the current quizz.
		$questions = $quizzSession->quizz->questions;

		// Current question (or null)
		$question = $quizzSession->question;
//		if ($quizzSession->index > 0 and $quizzSession->index <= count($questions)) {
//			$question = QuestionResource::make($quizzSession->quizz->questions[$quizzSession->index - 1]);
//		}

		$quizzSession->quizz->unsetRelation('questions');

		return Inertia::render('Quizzs/QuizzShow',
			[
				"quizzSession" => $quizzSession,
				"question" => $question===null?null:QuestionResource::make($question),
				"total" => count($questions)
			]
		);
	}

	public function dashboard(QuizzSession $quizzSession)
	{
		return Inertia::render('Quizzs/QuizzDashboard',
			[
				"quizzSession"=>QuizzSessionRessource::make($quizzSession),
			]
		);
	}

	public function projection(QuizzSession $quizzSession)
	{
		// Get all user answers.
		$usersId = $quizzSession->users->pluck('id');
		$question = $quizzSession->question;
		$answers = [];

		if($question!==null){
			// On a une question
			// Recherche de toutes les réponses et filtrer avec les utilisateurs
			$answers = $question->answersFrom($quizzSession->users->pluck('id'));
		}

		return Inertia::render('Quizzs/QuizzProjection',
			[
				"quizzSession" => QuizzSessionRessource::make($quizzSession),
				"results" => $answers,
				"usersCount"=>$quizzSession->users->count(),
			]
		);
	}

	public function updateCurrent(QuizzSession $quizzSession, Request $request)
	{
		$validate = $request->validate(["index"=>["int", "min:0"]]);

		$quizzSession->index = $validate["index"];
		$quizzSession->save();

		return redirect()->route('quizzs.dashboard', [$quizzSession->shortcode]);
	}

	public function updateEnable(QuizzSession $quizzSession, Request $request)
	{
		$validate = $request->validate(["enable"=>["bool"]]);

		$quizzSession->enable = $validate["enable"];
		$quizzSession->save();

		return redirect()->route('quizzs.dashboard', [$quizzSession->shortcode]);
	}
}
