<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;

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

	public function update(Request $request, Team $team)
	{
		$validated = $request->validate([
			'active' => ['boolean'],
			'name'   => ['string']
		]);

		$team->update($validated);
		return response()->noContent();
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
			"user"  => $user->id,
			"teams" => $user->teams,
		];
	}

	public function users(Team $team)
	{
		return UserResource::collection($team->users);
	}

}
