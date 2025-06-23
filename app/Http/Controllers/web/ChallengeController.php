<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Team;
use App\Models\Theme;
use Inertia\Inertia;
use function redirect;

class ChallengeController extends Controller
{
	public function index()
	{
		// TODO: get all challenges with the "opened" sessions only...
		$challenges = Challenge::with('sessions')
		                       ->orderBy('title')
		                       ->get();

		return Inertia::render('Challenges/ChallengesIndex', [
			'challenges' => $challenges
		]);
	}

	public function quick(Challenge $challenge)
	{
		// Get the theme
		$theme = Theme::where('slug', '=', $challenge->chapter->theme->slug)->first();

		if (!$theme->exists()) {
			return redirect()->back();
		}

		return redirect()->route('chapters.challenges.show', [$theme, $challenge->chapter, $challenge]);
	}

	public function show(Theme $theme, Chapter $chapter, Challenge $challenge)
	{
		// Make sure the default block description exists
		if (count($challenge->blocks) === 0) {
			$challenge->blocks()->create();
		}

		// If the user is connected, get the scores.

		return Inertia::render('Challenges/ChallengeShow', [
			"challenge" => ChallengeResource::make($challenge),
			"teams"     => Team::all()
		]);
	}

	public function edit(Challenge $challenge)
	{
		return Inertia::render("Challenges/ChallengeEdit", [
			'challenge' => ChallengeResource::make($challenge)
		]);
	}

	public function teams(Theme $theme, Chapter $chapter, Challenge $challenge, Team $team)
	{
		return redirect()->route('teams.challenge', [$team, $challenge]);
	}
}
