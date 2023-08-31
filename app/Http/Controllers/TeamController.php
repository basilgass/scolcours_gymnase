<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChallengeResource;
use App\Http\Resources\ChapterMinResource;
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
		return Inertia::render("Teams/TeamsIndex", [
			'teams'=> Team::all()
		]);
	}
	public function show(Team $team)
	{
		return Inertia::render("Teams/TeamsShow",
			[
				'team' => $team,
				'students'=>UserResource::collection($team->users),
				'chapters'=>ChapterMinResource::collection(Chapter::where('active', true)->get()),
				'challenges' =>ChallengeResource::collection(Challenge::all()),
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
		if ($user->team?->id === $team->id) {
			$user->team()->dissociate();
			$updatedTeam = null;
		} else {
			$user->team()->associate($team);
		}
		$user->save();

		return [
			"user" => $user->id,
			"team" => $updatedTeam
		];
	}

	public function challenge(Team $team, Challenge $challenge)
	{
		$user_ids = $team->users->pluck('id');
		$scores = $challenge->scores->whereIn('user_id', $user_ids);

		return Inertia::render("Teams/TeamsChallengePage", [
			'team' => $team,
			'challenge' => ChallengeResource::make($challenge),
			'scores' => $scores
		]);
	}

	public function stats(Team $team, Chapter $chapter)
	{
		// Get all users that has answered a question from this chapter.
		// 1. Filter the users to match a "classroom"
		// 2. For all users, get the "most advanced" exercise, the percentage of resolving, ...
		// 3. display the result

		// Doit récupérer les utilisateurs du "groupe/classe"
		$users = $team->users;
		$users_id = $users->map(fn($user) => $user->id);

		$stats = [];
		foreach ($chapter->posts as $post) {
			if (count($post->questions) > 0) {
				$stats[$post->id] = [
					'title' => $post->title,
					'type' => $post->type,
					'questions' => $post->questions->map(function ($question) use ($users_id) {
						/** Chaque question doit contenir
						 * id et body (pour l'affichage et l'unicité)
						 * resolved: le nombre d'utilisateurs du groupe ayant répondu correctement
						 * answers: le nombre de réponses moyenne par utilisateur nécessaire pour répondre à la question
						 */

						// Liste des utilisateurs du groupe qui ont répondu à cette question
						$filteredUsers = $question->users->whereIn('id', $users_id);

						$answers = $filteredUsers->countBy(function ($user) {
							return $user->id;
						});

						return [
							'id' => $question->id,
							'body' => $question->body,
							'resolved' => $filteredUsers->where('pivot.result', 1)->count(),
							'answers' => [
								'min' => $answers->min(),
								'max' => $answers->max(),
								'average' => $answers->average()
							]
						];
					}
					)];
			}
		}
		return Inertia::render(
			'Admin/AdminStatsShow.vue',
			[
				"team" => $team,
				"chapter" => $chapter,
				"users" => $users->count(),
				"stats" => $stats
			]
		);
	}
}
