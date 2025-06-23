<?php

namespace App\Traits;

use App\Http\Resources\ScoreResource;
use App\Models\Score;
use App\Models\User;
use Auth;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Cache;

trait HasScoresTrait
{
	private int|float $cacheTime = 15 * 60; // 15 minutes

	public function users(): HasManyThrough
	{
		return $this
			->hasManyThrough(
				User::class,
				Score::class,
				'scoreable_id', // Foreign key on scores table
				'id', // Foreign key on user table
				'id', // Local key on current model
				'user_id' // Local key on scores table
			)
			->where('scoreable_type', self::class); // Permet de récupérer seulement les scores du modèle en cours.
	}

	public function userScores()
	{
		$user = Auth::user();

		return $user
			? $this->scoresFromUser($user)
			: [
				'id'         => 0,
				'answer'     => "HELLO WORLD",
				'result'     => false,
				'attempts'   => 0,
				'updated_at' => null,
			];;
	}

	public function scoresFromUser(User $user)
	{
		$cacheKey = $this->getCacheKey($user);

		return Cache::remember($cacheKey, $this->cacheTime,
			function () use ($user) {
				$score = $this->scoreFor($user);

				// Le score n'existe pas ? On le créé.
				if (!$score) {
					// The score does not exist and the user is connected.
					$score = $this->scores()->create([
						"user_id" => $user->id,
						"score"   => 0,
					]);
				};

				return ScoreResource::make($score);
			});
	}

	public function getCacheKey(User $user): string
	{
		// Base name of the class
		$name = strtolower(class_basename($this));

		return "scores_for_user:{$user->id}_model_{$name}:{$this->id}";
	}

	public function scoreFor(User $user): Score|null
	{
		return $this->scores()->where('user_id', $user?->id)->first();
	}

	public function scores(): MorphMany
	{
		return $this->morphMany(Score::class, 'scoreable');
	}

	public function updateCache(Score $score)
	{
		$cacheKey = $this->getCacheKey($score->user);
		// Invalidate the cache.
		Cache::forget($cacheKey);

		return Cache::remember($cacheKey, $this->cacheTime,
			function () use ($score) {
				return ScoreResource::make($score);
			});

	}
}
