<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Team;
use Inertia\Inertia;

class TeamController extends Controller
{
	public function index()
	{
		return Inertia::render("Teams/admin/AdminTeamIndex", [
			'teams' => Team::with('users')->get()->map(function ($team) {
				return [
					'id'          => $team->id,
					'name'        => $team->name,
					'active'      => $team->active,
					'users_count' => $team->users->count(),
				];
			})
		]);
	}

	public function show(Team $team)
	{
		return Inertia::render("Teams/admin/AdminTeamShow",
			[
				'team'       => $team,
				'students'   => UserResource::collection($team->users),
				'courses'    => CourseResource::collection($team->courses),
				'challenges' => ChallengeResource::collection(Challenge::all())
			]
		);
	}

	public function challenge(Team $team, Challenge $challenge)
	{
		$user_ids = $team->users->pluck('id');
		$scores = $challenge->scores
			->sortBy('score', SORT_REGULAR, true)
			->whereIn('user_id', $user_ids)
			->values()->all();

		return Inertia::render("Teams/TeamChallengeShow", [
			'team'      => $team,
			'challenge' => ChallengeResource::make($challenge),
			'scores'    => $scores
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
				"id"        => $post->id,
				"title"     => $post->title,
				"type"      => $post->type,
				"questions" => []
			];


			foreach ($post->questions as $question) {
				$statQuestion = [
					"id"    => $question->id,
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
				"team"    => TeamResource::make($team),
				"chapter" => ChapterResource::make($chapter),
				"stats"   => $stats
			]
		);
	}
}
