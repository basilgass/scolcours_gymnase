<?php

namespace App\Support;

use App\Models\Score;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Collection;

class ScoreLeaderboard
{
	private ?User $user = null;
	private array $teams = [];

	private function __construct(private readonly Model $model)
	{
	}

	public static function for(Model $model): static
	{
		return new static($model);
	}

	public function withUser(?User $user): static
	{
		$this->user = $user;

		return $this;
	}

	public function withTeams(array $teams): static
	{
		$this->teams = $teams;

		return $this;
	}

	/**
	 * Top N scores globaux avec moyenne et médiane sur l'ensemble des scores.
	 *
	 * @return object{scores: Collection<Score>, average: float|null, median: float|null, rank: int|null, total: int}
	 */
	public function topStats(int $limit): object
	{
		$base = $this->rankedQuery();
		$scores = (clone $base)->limit($limit)->get();
		$average = $this->model->scores()->whereNotNull('attempts')->avg('score');
		$median = $this->calculateMedian(
			$this->model->scores()->whereNotNull('attempts')->pluck('score')
		);
		$total = (clone $base)->count();
		$rank = $this->calculateUserRank($base);

		return (object)compact('scores', 'average', 'median', 'rank', 'total');
	}

	/**
	 * Scores de tous les membres des teams fournies, avec moyenne et médiane.
	 *
	 * @return object{scores: Collection<Score>, average: float|null, median: float|null, rank: int|null, total: int}|null
	 */
	public function teamStats(): ?object
	{
		if (empty($this->teams)) {
			return null;
		}

		$userIds = $this->teamUserIds();
		$base = $this->rankedQuery();
		$base->whereIn('user_id', $userIds);
		$scores = (clone $base)->get();
		$average = $scores->avg('score');
		$median = $this->calculateMedian($scores->pluck('score'));
		$total = $scores->count();
		$rank = $this->calculateUserRank($base);

		return (object)compact('scores', 'average', 'median', 'rank', 'total');
	}

	private function calculateUserRank(MorphMany $base): ?int
	{
		if (!$this->user) {
			return null;
		}

		$userScore = $this->model->scoreFor($this->user);

		if (!$userScore || $userScore->attempts === null) {
			return null;
		}

		$isChrono = $this->isChronoRanking();
		$betterOp = $isChrono ? '<' : '>';

		$betterThan = fn(Builder $q) => $q
			->where('score', $betterOp, $userScore->score)
			->orWhere(fn(Builder $q) => $q
				->where('score', $userScore->score)
				->where('attempts', '<', $userScore->attempts)
			)
			->orWhere(fn(Builder $q) => $q
				->where('score', $userScore->score)
				->where('attempts', $userScore->attempts)
				->where('updated_at', '<', $userScore->updated_at)
			);

		return (clone $base)->where($betterThan)->count() + 1;
	}

	private function rankedQuery(): MorphMany
	{
		$direction = $this->isChronoRanking() ? 'asc' : 'desc';

		return $this->model
			->scores()
			->with('user')
			->whereNotNull('attempts')
			->orderBy('score', $direction)
			->orderBy('attempts', 'asc')
			->orderBy('updated_at', 'asc');
	}

	private function isChronoRanking(): bool
	{
		return property_exists($this->model, 'type') && $this->model->type === 'chrono';
	}

	private function calculateMedian(Collection $values): ?float
	{
		$sorted = $values->sort()->values();
		$count = $sorted->count();

		if ($count === 0) {
			return null;
		}

		$mid = intdiv($count, 2);

		return $count % 2 === 0
			? ($sorted[$mid - 1] + $sorted[$mid]) / 2
			: (float)$sorted[$mid];
	}

	private function teamUserIds(): Collection
	{
		return collect($this->teams)
			->flatMap(fn(Team $team) => $team->users->pluck('id'))
			->unique();
	}
}
