<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\TeamResource;
use App\Models\Challenge;
use App\Models\Team;
use App\Support\ScoreLeaderboard;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function redirect;

class ChallengeController extends Controller
{
	public function index()
	{
		return Inertia::render('Challenges/ChallengeIndex', [
			'challenges' => ChallengeResource::collection(Challenge::all())
		]);
	}

	public function show(Challenge $challenge): \Inertia\Response
	{
		// Make sure the default block description exists
		if (count($challenge->blocks) === 0) {
			$challenge->blocks()->create();
		}

		return Inertia::render('Challenges/ChallengeShow', [
			"challenge" => ChallengeResource::make($challenge),
			"teams"     => Team::active()->get()
		]);
	}

	public function edit(Challenge $challenge)
	{
		return Inertia::render("Challenges/ChallengeEdit", [
			'challenge' => ChallengeResource::make($challenge)
		]);
	}

	public function teams(Challenge $challenge, Team $team)
	{
		return redirect()->route('admin.teams.challenges.show', ["team" => $team, "challenge" => $challenge]);
	}

	public function hallOfFame(Challenge $challenge, Request $request)
	{
		// Teams optionnelles passées via ?teams[]=1&teams[]=2
		$teams = Team::with('users')
		             ->whereIn('name', $request->input('teams', []))
		             ->get()
		             ->all();

		$leaderboard = ScoreLeaderboard::for($challenge)
		                               ->withUser($request->user())
		                               ->withTeams($teams);

		return Inertia::render("Challenges/ChallengeHallOfFame", [
			'challenge' => ChallengeResource::make($challenge),
			'teams'     => TeamResource::collection($teams),
			'global'    => $leaderboard->topStats(10),
			'teamStats' => $leaderboard->teamStats(),
		]);
	}
}
