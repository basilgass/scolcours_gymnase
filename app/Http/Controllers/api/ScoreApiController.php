<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\updateScoreRequest;
use App\Http\Resources\ScoreResource;
use App\Models\Score;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;

class ScoreApiController extends Controller
{
	public function index(Request $request)
	{
		$request->validate([
			'type' => ['string'],
			'ids'  => ['required', 'array']
		]);

		$ids = $request->input('ids');

		if (!$request->has('type')) {
			// On retourne les scores par leur ids directement.
			$scores = Score::whereIn('id', $ids)->get();
			return ScoreResource::collection($scores);
		}

		// Post | Question | Deck | Card | Challenge | Generator | Lesson

		$type = 'App\\Models\\' . ucfirst($request->input('type')); // ou directement passé en FQCN

		$userId = Auth::id();
		if ($request->has('user_id') && Auth::user()?->admin) {
			$id = $request->input('user_id');

			$user = User::find($id);
			if ($user->exists()) {
				$userId = $id;
			}
		}

		// récupérer les scores existants
		$existingScores = Score::where('user_id', $userId)
		                       ->where('scoreable_type', $type)
		                       ->whereIn('scoreable_id', $ids)
		                       ->get()
		                       ->keyBy('scoreable_id');

		// créer ceux qui manquent
		$missingScores = collect($ids)
			->filter(fn($id) => !$existingScores->has($id))
			->map(fn($id) => Score::create([
				'user_id'        => $userId,
				'scoreable_type' => $type,
				'scoreable_id'   => $id,
				'score'          => 0, // ou null, selon ton modèle
			]));

		// fusionner les deux
		$allScores = $existingScores->values()->merge($missingScores);

		return ScoreResource::collection($allScores);
	}

	public function show(Score $score)
	{
		return ScoreResource::make($score);
	}

	public function update(updateScoreRequest $request, Score $score)
	{
		$validated = $request->validated();

		// persist the incoming data
		$score->update($validated);

		// Le $validated n'a pas forcément d'attempts (règle nullable) : on incrémente
		// la valeur courante du score plutôt que de lire une clé éventuellement absente.
		if ($score->attempts === null) {
			$score->attempts = 1;
		} else {
			$score->attempts = $score->attempts + 1;
		}
		$score->save();
		$score->refresh();


		// Recreate the cache for this element.
		$score->scoreable->updateCache($score);

		// Ensure fresh model is returned
		$score->refresh();

		return ScoreResource::make($score);
	}

	public function destroyMultiple(Request $request)
	{
		$ids = $request->input('ids', []);
		Score::whereIn('id', $ids)->delete();

		return response()->noContent(); // 204
	}

}
