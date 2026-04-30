<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Models\Challenge;
use App\Models\Team;
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

	public function leaderboard(Challenge $challenge, Request $request)
	{
		return Inertia::render("Challenges/ChallengeLeaderboard", [
			'challenge' => ChallengeResource::make($challenge),
			'teams'     => $request->input('teams', []),
		]);
	}
}
