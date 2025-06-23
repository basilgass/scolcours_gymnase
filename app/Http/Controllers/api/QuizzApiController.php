<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Quizz;
use App\Models\QuizzSession;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class QuizzApiController extends Controller
{

	public function index()
	{

	}

	public function store(Request $request)
	{
		return Quizz::create()->id;
	}

	public function destroy(Quizz $quizz)
	{
		$quizz->delete();

		return true;
	}

	public function updateCurrent(QuizzSession $quizzSession, Request $request)
	{
		$validate = $request->validate(["index" => ["int", "min:0"]]);

		$quizzSession->index = $validate["index"];
		$quizzSession->save();

		return response()->noContent();
	}

	public function updateEnable(QuizzSession $quizzSession, Request $request)
	{
		$validate = $request->validate(["enable" => ["bool"]]);

		$quizzSession->enable = $validate["enable"];
		$quizzSession->save();

		return response()->noContent();
	}

	public function updateQuestionsOrder(Quizz $quizz, Request $request)
	{
		foreach ($request['order'] as $value) {
			$quizz->questions->find($value['id'])->update(['order' => $value['order']]);
		}

		return response()->noContent();
	}

	public function update(Quizz $quizz, Request $request)
	{
		$validated = $request->validate([
			'title'      => ['string', 'min:2'],
			'body'       => ['string', 'min:2'],
			'outro'      => ['string', 'min:0', 'nullable'],
			'chapter_id' => ['exists:App\Models\Chapter,id', 'nullable'],
		]);

		$quizz->update($validated);

		return true;
	}

	public function sessionCreate(Quizz $quizz, Request $request)
	{
		$validated = $request->validate([
			"name" => ['string', 'min:2', 'unique:quizz_sessions,shortcode'],
			"team" => ['int', 'exists:App\Models\Team,id']
		]);

		$session = $quizz->sessions()->create([
			"shortcode" => $validated['name']
		]);

		// Get the users from the team
		$team = Team::find($validated['team']);
		foreach ($team->users as $user) {
			$session->users()->attach($user);
		}

		return response()->noContent();
	}

	public function sessionDestroy(QuizzSession $quizzSession)
	{
		$quizzSession->delete();

		return response()->noContent();
	}
}
