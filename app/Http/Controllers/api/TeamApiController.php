<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
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

	public function store(Request $request): Model|Team
	{
		$validated = $request->validate([
			'name' => ['string', 'min:2', 'max:100']
		]);

		return Team::create(["name" => $validated['name']]);
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


}
