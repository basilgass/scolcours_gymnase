<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * App\Models\Score
 *
 * @property int $id
 * @property int $user_id
 * @property string $scoreable_type
 * @property int $scoreable_id
 * @property int $score
 * @property int|null $level
 * @property int|null $stars
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Challenge> $challenges
 * @property-read int|null $challenges_count
 * @property-read Model|\Eloquent $scoreable
 * @property-read Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static Builder<static>|Score newModelQuery()
 * @method static Builder<static>|Score newQuery()
 * @method static Builder<static>|Score query()
 * @method static Builder<static>|Score whereCreatedAt($value)
 * @method static Builder<static>|Score whereId($value)
 * @method static Builder<static>|Score whereLevel($value)
 * @method static Builder<static>|Score whereScore($value)
 * @method static Builder<static>|Score whereScoreableId($value)
 * @method static Builder<static>|Score whereScoreableType($value)
 * @method static Builder<static>|Score whereStars($value)
 * @method static Builder<static>|Score whereUpdatedAt($value)
 * @method static Builder<static>|Score whereUserId($value)
 * @mixin Eloquent
 */
class Score extends Model
{
	use HasFactory;

	protected $fillable = [
		"user_id",
		"data",
		"attempts",
		"is_resolved",
		"score",
	];

	protected $casts = [
		'data' => 'array'
	];

	/**
	 * Permet de récupérer les modèles qui ont un score:
	 * Post, Questiom, Deck, Card, Challenge, Generator
	 * @return MorphTo
	 */
	public function scoreable(): MorphTo
	{
		return $this->morphTo();
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
