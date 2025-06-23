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


		return response()->noContent();
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
			'stars' => ['nullable', 'int', 'min:0', 'max:5'],
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

}
