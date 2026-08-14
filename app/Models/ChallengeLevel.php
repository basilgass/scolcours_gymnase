<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * App\Models\ChallengeLevel
 *
 * @property int $id
 * @property int $challenge_id
 * @property int $level_number
 * @property int $points_to_pass
 * @property array<array-key, mixed>|null $bonus
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Challenge $challenge
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Generator> $generators
 * @property-read int|null $generators_count
 * @method static \Database\Factories\ChallengeLevelFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel whereBonus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel whereChallengeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel whereLevelNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel wherePointsToPass($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChallengeLevel whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ChallengeLevel extends Model
{
	use HasFactory;

	protected $guarded = [];

	protected function casts(): array
	{
		return [
			'bonus' => 'array',
		];
	}

	public function challenge(): BelongsTo
	{
		return $this->belongsTo(Challenge::class);
	}

	public function generators(): MorphToMany
	{
		return $this
			->morphToMany(Generator::class, 'generatorable')
			->withPivot('id', 'label', 'order', 'config', 'parameters')
			->orderByPivot('order');
	}
}
