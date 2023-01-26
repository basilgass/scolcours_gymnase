<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChallengeResource;
use App\Models\Challenge;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
	public function store(Request $request): \Illuminate\Database\Eloquent\Model|Team
	{
		$validation = $request->validate([
			'name'=>['string', 'min:2', 'max:100']
		]);

		return Team::create(["name"=>$validation['name']]);
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
		if($user->team?->id===$team->id){
			$user->team()->dissociate();
			$updatedTeam = null;
		}else {
			$user->team()->associate($team);
		}
		$user->save();

		return [
			"user"=>$user->id,
			"team"=>$updatedTeam
		];
    }

	public function challenge(Team $team, Challenge $challenge)
	{
		$user_ids = $team->users->pluck('id');
		$scores = $challenge->scores->whereIn('user_id', $user_ids);

		return Inertia::render("Teams/TeamsChallengePage", [
			'team' => $team,
			'challenge'=>ChallengeResource::make($challenge),
			'scores'=>$scores
		]);
	}
}
