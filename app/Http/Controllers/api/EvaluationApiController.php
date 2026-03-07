<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EvaluationResource;
use App\Http\Resources\ScoreResource;
use App\Http\Resources\UserResource;
use App\Models\Evaluation;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EvaluationApiController extends Controller
{
	public function index()
	{

	}

	public function show($id)
	{
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			"slug"  => ['required', 'string', 'unique:App\Models\Evaluation,slug'],
			"title" => ['required', 'string'],
		]);

		$validated['body'] = "";
		$evaluation = Evaluation::create($validated);

		return EvaluationResource::make($evaluation);
	}

	public function update(Request $request, Evaluation $evaluation)
	{

		$validated = $request->validate([
			"title"        => ['required', 'string'],
			"slug"         => ['sometimes', 'string', Rule::unique(Evaluation::class, 'slug')->ignore($evaluation->id)],
			"body"         => ['required', 'string'],
			"auto_control" => ['required', 'boolean'],
		]);

		// On contrôle que si il y a un nouveau slug, il doit être unique
		$evaluation->update($validated);

		return response()->noContent();
	}

	public function destroy($id)
	{
	}

	public function scores(Evaluation $evaluation, Team $team)
	{
		$questionIds = $evaluation->questions->pluck('id');
		$users = $team->users;

		$scoresByUser = [];
		foreach ($users as $user) {
			$scoresByUser[] = [
				"user"   => UserResource::make($user),
				"scores" => ScoreResource::collection($user->scores
					->whereIn('scoreable_id', $questionIds))
			];
		}


		return $scoresByUser;
	}

	public function toggleTeam(Evaluation $evaluation, Team $team)
	{
		$attached = $evaluation->teams()->where('teams.id', $team->id)->exists();

		if ($attached) {
			$status = false;
			$evaluation->teams()->detach($team->id);
		} else {
			$status = true;
			$evaluation->teams()->attach($team->id);
		}
		return $status;
	}
}
