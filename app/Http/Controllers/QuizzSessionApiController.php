<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuizzSessionRessource;
use App\Models\Quizz;
use App\Models\QuizzSession;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QuizzSessionApiController extends Controller
{
	public function index(Quizz $quizz)
	{

		return QuizzSessionRessource::collection(
			$quizz->sessions
				->sortBy('created_at', SORT_REGULAR, SORT_DESC)
		);
	}

	public function show(QuizzSession $session)
	{
	}

	public function store(Request $request, Quizz $quizz)
	{
		$validated = $request->validate([
			"team" => ['int', 'exists:App\Models\Team,id']
		]);

		$team = Team::find($validated['team']);

		// création d'un shortcode de 4-5 lettres majuscules.
		$shortcode = $this->generateUniqueShortcode();
		$session = $quizz->sessions()->create([
			'shortcode' => $team->name . '-' . $shortcode
		]);

		// Get the users from the team
		$team = Team::find($validated['team']);
		foreach ($team->users as $user) {
			$session->users()->attach($user);
		}

		$session->refresh();

		return QuizzSessionRessource::make($session);
	}

	public function update(Request $request, QuizzSession $session)
	{
	}

	public function destroy(QuizzSession $session)
	{
		$id = $session->id;
		$result = $session->delete();
		return [$id, $result];
	}

	public function generateUniqueShortcode(int $length = 3): string
	{
		do {
			$code = Str::upper(Str::random($length));
		}while (QuizzSession::where('shortcode', $code)->exists());

		return $code;
	}
}
