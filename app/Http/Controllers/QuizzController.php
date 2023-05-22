<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuestionResource;
use App\Http\Resources\QuizzSessionRessource;
use App\Models\Chapter;
use App\Models\Quizz;
use App\Models\QuizzSession;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizzController extends Controller
{

	public function index()
	{
		//TODO: est-il utile d'avoir cette page, vu qu'il est prévu que ce soit par invitation. Prémice pour l'utilisation sans utilisateur ?
		return Inertia::render("Quizzs/QuizzHome",
			["shortcode" => null]
		);
	}

	public function store(Request $request)
	{
		return Quizz::create()->id;
	}
	public function update(Quizz $quizz, Request $request)
	{
		$validation = $request->validate([
			'title'=>['string', 'min:2'],
			'body'=>['string', 'min:2'],
			'outro'=>['string', 'min:0', 'nullable'],
			'chapter_id'=>['exists:App\Models\Chapter,id', 'nullable'],
		]);

		$quizz->update($validation);

		return true;
	}

	public function destroy(Quizz $quizz)
	{
		$quizz->delete();

		return true;
	}
	public function admin()
	{
		return Inertia::render('Quizzs/QuizzAdmin',
			[
				"quizzs" => Quizz::all()
			]
		);
	}

	public function adminQuizz(Quizz $quizz)
	{

		$data = [
			"quizz" => $quizz,
			"questions" => QuestionResource::collection($quizz->questions),
			"sessions" => QuizzSessionRessource::collection($quizz->sessions),
			"teams" => Team::all(),
			"chapters" => Chapter::all()->map(function ($chapter){
				return [
					'id'=>$chapter->id,
					'title'=>$chapter->title,
					'theme'=>$chapter->theme->slug
				];
			}),
		];

		// Add the theme to the main layout page
		if($quizz->chapter){
			$data["theme"] = $quizz->chapter?->theme->only('color', 'icon', 'slug', 'title', 'id');
		}
		return Inertia::render('Quizzs/QuizzAdminEdit',$data);

	}


	public function show(QuizzSession $quizzSession)
	{
		// User must be logged in
		if (!\Auth::user()) {
			return redirect()->route('login');
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
				"question" => $question === null ? null : QuestionResource::make($question),
				"total" => count($questions)
			]
		);
	}

	public function dashboard(QuizzSession $quizzSession)
	{
		return Inertia::render('Quizzs/QuizzDashboard',
			[
				"quizzSession" => QuizzSessionRessource::make($quizzSession),
			]
		);
	}

	public function projection(QuizzSession $quizzSession)
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

	public function updateCurrent(QuizzSession $quizzSession, Request $request)
	{
		$validate = $request->validate(["index" => ["int", "min:0"]]);

		$quizzSession->index = $validate["index"];
		$quizzSession->save();

		return redirect()->route('quizzs.sessions.dashboard', [$quizzSession->shortcode]);
	}

	public function updateEnable(QuizzSession $quizzSession, Request $request)
	{
		$validate = $request->validate(["enable" => ["bool"]]);

		$quizzSession->enable = $validate["enable"];
		$quizzSession->save();

		return redirect()->route('quizzs.sessions.dashboard', [$quizzSession->shortcode]);
	}

	public function updateQuestionsOrder(Quizz $quizz, Request $request)
	{
		foreach ($request['order'] as $value) {
			$quizz->questions->find($value['id'])->update(['order' => $value['order']]);
		}

		return true;
	}

	public function sessionCreate(Quizz $quizz, Request $request)
	{
		$validation = $request->validate([
			"name"=>['string', 'min:2', 'unique:quizz_sessions,shortcode'],
			"team"=>['int', 'exists:App\Models\Team,id']
		]);

		$session = $quizz->sessions()->create([
			"shortcode"=>$validation['name']
		]);

		// Get the users from the team
		$team = Team::find($validation['team']);
		foreach ($team->users as $user){
			$session->users()->attach($user);
		}
	}

	public function sessionDestroy(QuizzSession $quizzSession)
	{
		$quizzSession->delete();
	}
}
