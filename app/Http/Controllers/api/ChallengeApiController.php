<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\ScoreResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Team;
use App\Support\ScoreLeaderboard;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use function redirect;

class ChallengeApiController extends Controller
{
	public function show(Challenge $challenge)
	{
		if ($challenge->blocks->isEmpty()) {
			$challenge->blocks()->create();
			$challenge->load('blocks');
		}

		return ChallengeResource::make($challenge);
	}

	public function store(Chapter $chapter, Request $request)
	{
		$validated = $request->validate([
			'title' => ['string', 'min:5']
		]);

		$slug = Str::slug($request['title']);
		if (Challenge::where('slug', $slug)->first()) {
			return redirect()->back();
		}

		$challenge = $chapter->challenges()->create([
			'title' => $validated['title'],
			'slug'  => $slug
		]);

		// Le block par défaut est créé par Challenge::booted() (événement created).

		return redirect()->route('challenges.show', $challenge);
	}

	public function update(Challenge $challenge, Request $request)
	{
		unset($request['block']);

		// Save the challenge configuration
		$validated = $request->validate([
			'slug'       => ['required', 'min:2'],
			'title'      => ['required', 'min:2'],
			'active'     => ['boolean'],
			'time_limit' => ['numeric', 'min:0'],
			'lives'      => ['numeric', 'min:0'],
			'type'       => ['string', 'in:classic'],
		]);

		$challenge->update($validated);

		return true;
	}

	public function destroy($id)
	{
		Challenge::destroy($id);

		return true;
	}

	public function index()
	{
		$challenges = Challenge::orderBy('title')
		                       ->get();
		return ChallengeResource::collection($challenges);
	}

	public function leaderboard(Challenge $challenge, Request $request)
	{
		// Teams optionnelles passées via ?teams[]=1&teams[]=2
		$teams = Team::with('users')
		             ->whereIn('name', $request->input('teams', []))
		             ->get()
		             ->all();

		$leaderboard = ScoreLeaderboard::for($challenge)
		                               ->withUser($request->user())
		                               ->withTeams($teams);

		$global = $leaderboard->topStats(10);
		$global->scores = ScoreResource::collection($global->scores);

		$teamStats = $leaderboard->teamStats();
		if ($teamStats) {
			$teamStats->scores = ScoreResource::collection($teamStats->scores);
		}

		return [
			'global'    => $global,
			'teamStats' => $teamStats ?? null,
			'teams'     => $teams ?? []

		];
	}
}
