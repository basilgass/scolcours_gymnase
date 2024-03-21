<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChallengeResource;
use App\Http\Resources\ChapterMinResource;
use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
	public function index()
	{
		return Inertia::render("Teams/TeamIndex", [
			'teams' => Team::with('users')->get()->map(function ($team) {
				$team->users_count = $team->users->count();
				return [
					'id' => $team->id,
					'name' => $team->name,
					'users_count' => $team->users_count,
				];
			})
		]);
	}

	public function show(Team $team)
	{
		return Inertia::render("Teams/TeamShow",
			[
				'team' => $team,
				'students' => UserResource::collection($team->users),
				'chapters' => ChapterMinResource::collection(Chapter::where('active', true)->get()),
				'challenges' => ChallengeResource::collection(Challenge::all()),
			]
		);
	}

	public function store(Request $request): \Illuminate\Database\Eloquent\Model|Team
	{
		$validation = $request->validate([
			'name' => ['string', 'min:2', 'max:100']
		]);

		return Team::create(["name" => $validation['name']]);
	}

	public function destroy(Team $team)
	{
		$name = $team->name;
		$team->delete();
		return $name;
	}

	public function toggle(User $user, Team $team): array
	{
		$updatedTeam = $team->name;

		if ($user->teams->contains($team->id)) {
			$user->teams()->detach($team->id);
			$updatedTeam = null;
		} else {
			$user->teams()->attach($team);
		}
		$user->save();
		$user->refresh();

		return [
			"user" => $user->id,
			"teams" => $user->teams,
		];
	}

	public function challenge(Team $team, Challenge $challenge)
	{
		$user_ids = $team->users->pluck('id');
		$scores = $challenge->scores
			->sortBy('score', SORT_REGULAR, true)
			->whereIn('user_id', $user_ids)
			->values()->all();

		return Inertia::render("Teams/TeamChallengeShow", [
			'team' => $team,
			'challenge' => ChallengeResource::make($challenge),
			'scores' => $scores
		]);
	}

	public function stats(Team $team, Chapter $chapter)
	{
		/**
		 * for the chapter, get all the posts
		 * for each post, get all the questions
		 * for each question, get all the users from the team that have answered
		 */

		// Users
		$users_id = $team->users->pluck('id');

		$stats = [];

		// Get in one request all the questions from the chapter
		$data = $chapter
			->posts()
			->with('questions.users')
			->whereHas('questions')
			->get();

		foreach ($data as $post) {
			$stat = [
				"id" => $post->id,
				"title" => $post->title,
				"type" => $post->type,
				"questions" => []
			];


			foreach ($post->questions as $question) {
				$statQuestion = [
					"id" => $question->id,
					"users" => []
				];

				// Initialise the users
				foreach ($users_id as $user_id) {
					$statQuestion["users"][$user_id] = null;
				}

				foreach ($question->users as $user) {
					if ($users_id->contains($user->id)) {
						$statQuestion["users"][$user->id] = $user->pivot->result;
					}
				}
				$stat["questions"][] = $statQuestion;
			}

			$stats[] = $stat;
		}

		return Inertia::render(
			'Teams/TeamPostShow',
			[
				"theme" => $chapter->theme,
				"team" => TeamResource::make($team),
				"chapter" => ChapterMinResource::make($chapter),
				"stats" => $stats
			]
		);
	}
}
