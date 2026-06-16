<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\ScoreResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Team;
use App\Models\Theme;
use App\Support\ScoreLeaderboard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use function redirect;

class ChallengeApiController extends Controller
{
	public function show(Challenge $challenge)
	{
		if (count($challenge->blocks) === 0) {
			$challenge->blocks()->create();
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

		$challenge->blocks()->create();

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
		$challenge = Challenge::find($id);
		$theme = $challenge->chapter->theme->slug;
		$chapter = $challenge->chapter->slug;

		Challenge::destroy($id);

		// Redirect to ...
		//		return redirect(route('theme.chapter', [$theme, $chapter]));
		return true;
	}

	public function start(Challenge $challenge)
	{
		// Create new session with the user and redirect back.
		if (Auth::User()?->admin) {
			$challenge->sessions()->create(
				[
					"token"    => Str::random(4),
					"open"     => true,
					"user_id"  => Auth::User()->id,
					"duration" => 5000
				]
			);
		}
		$this->index();
	}

	public function index()
	{
		$challenges = Challenge::orderBy('title')
		                       ->get();
		return ChallengeResource::collection($challenges);
	}

	public function teams(Theme $theme, Chapter $chapter, Challenge $challenge, Team $team)
	{
		return redirect()->route('admin.teams.challenges.show', ["team" => $team, "challenge" => $challenge]);
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
