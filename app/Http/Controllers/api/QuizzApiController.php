<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuizzSessionRessource;
use App\Models\Quizz;
use App\Models\QuizzSession;
use Illuminate\Http\Request;

class QuizzApiController extends Controller
{

	public function store(Request $request)
	{
		$quizz = Quizz::create([
			"title" => "sans titre",
		]);

		$quizz->blocks()->create([
			'title' => 'intro'
		]);
		$quizz->blocks()->create([
			'title' => 'outro'
		]);

		return $quizz->id;
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
		$quizzSession->show_answer = false;
		$quizzSession->save();

		return QuizzSessionRessource::make($quizzSession);
	}

	public function updateShowAnswer(QuizzSession $quizzSession)
	{
		$quizzSession->show_answer = !$quizzSession->show_answer;
		$quizzSession->save();

		return QuizzSessionRessource::make($quizzSession);
	}

	public function updateEnable(QuizzSession $quizzSession, Request $request)
	{
		$validate = $request->validate(["enable" => ["bool"]]);

		$quizzSession->enable = $validate["enable"];
		$quizzSession->save();

		return response()->noContent();
	}

	public function update(Quizz $quizz, Request $request)
	{
		$validated = $request->validate([
			'title'      => ['string', 'min:2'],
			'chapter_id' => ['exists:App\Models\Chapter,id', 'nullable'],
		]);

		$quizz->update($validated);

		return true;
	}

}
