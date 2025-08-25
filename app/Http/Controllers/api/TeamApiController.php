<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserTeamResource;
use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Team;
use App\Models\Theme;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamApiController extends Controller
{
	public function index()
	{
		return TeamResource::collection(Team::all());
	}

	public function show(Team $team)
	{
		return TeamResource::make($team);
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'name' => ['string', 'min:2', 'max:100']
		]);

		$team = Team::create(["name" => $validated['name']]);
		return TeamResource::make($team);
	}

	public function destroy(Team $team)
	{
		$id = $team->id;
		$team->delete();
		return $id;
	}

	public function toggle(Team $team, User $user): array
	{
		if ($user->teams->contains($team->id)) {
			$user->teams()->detach($team->id);
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

	public function users(Team $team)
	{
		return UserResource::collection($team->users);
	}

}
