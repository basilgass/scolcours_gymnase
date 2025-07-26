<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\updateScoreRequest;
use App\Http\Resources\ScoreResource;
use App\Models\Challenge;
use App\Models\Post;
use App\Models\Score;
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

		if(!$request->has('type')){
			// On retourne les scores par leur ids directement.
			$scores = Score::whereIn('id', $ids)->get();
			return ScoreResource::collection($scores);
		}


		// Post | Question | Deck | Card | Challenge | Generator | Lesson

		$type = 'App\\Models\\' . ucfirst($request->input('type')); // ou directement passé en FQCN

		$userId = Auth::id();
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

	// REFACTOR: store is not used anymore.
	public function store(Request $request)
	{
		$validate = $request->validate([
			'user_id'      => ["exists:App\Models\User,id"],
			'challenge_id' => ["exists:App\Models\Challenge,id"],
			'score'        => ['int'],
			'level'        => ['int', 'nullable'],
			'stars'        => ['int', 'nullable']
		]);

		// Get the current score
		$currentScore = Score::where([
			'user_id'      => $validate['user_id'],
			'scoreable_id' => $validate['challenge_id']
		])->first()?->score ?? 0;

		Score::updateOrCreate(
			[
				'user_id'      => $validate['user_id'],
				'challenge_id' => $validate['challenge_id'],
			],
			[
				'score' => max($validate['score'], $currentScore),
				'level' => $validate['level'] ?? null,
				'stars' => $validate['stars'] ?? null,
			]
		);
	}

	public function update(updateScoreRequest $request, Score $score)
	{
		$validated = $request->validated();
		$score->update($validated);

		// Le $validated n'a pas d'attempts, on l'incrémente.
		if (!isset($validated['attempts'])) {
			$score->increment('attempts');
		}

		// Recreate the cache for this element.
		$score->scoreable->updateCache($score);

		$score->refresh();

		return ScoreResource::make($score);
	}

	public function reset(Score $score)
	{
		$score->score = 0;
		$score->is_resolved = false;
		$score->attempts = 0;
		$score->data = NULL;
		$score->save();
		$score->refresh();

		return ScoreResource::make($score);
	}

	// ROUTE: these route are no more used.
	public function updatePostScore(Post $post, Request $request)
	{
		return $this->updateScore($post, $request);
	}

	public function updateScore(Challenge|Post $item, Request $request)
	{
		$validate = $request->validate([
			'score' => ['int', 'min:0'],
			'level' => ['nullable', 'int', 'min:1'],
		]);

		$currentScore = null;
		if (Auth::user()) {
			$currentScore = $item->scores->where('user_id', Auth::user()->id)->first();

			// Make the score or update it.
			$item->scores()->updateOrCreate([
				'user_id' => Auth::user()->id,
			], [
				'score' => $validate["score"],
				'level' => $validate["level"] ?? null,
				'stars' => $validate["stars"] ?? null
			]);
		}

		return [
			'previous' => [
				'score' => $currentScore['score'] ?? 0,
				'level' => $currentScore['level'] ?? 1,
				'stars' => $currentScore['stars'] ?? 0
			],
			'updated'  => [
				'score' => $validate['score'],
				'level' => $validate['level'] ?? 1,
				'stars' => $validate['stars'] ?? 0
			]
		];

	}

	public function updateChallengeScore(Challenge $challenge, Request $request)
	{
		return $this->updateScore($challenge, $request);
	}

	public function destroyMultiple(Request $request)
	{
		$ids = $request->input('ids', []);
		Score::whereIn('id', $ids)->delete();

		return response()->noContent(); // 204
	}

}
