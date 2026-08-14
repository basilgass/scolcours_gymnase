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
 * @property float $score
 * @property bool|null $is_resolved
 * @property int|null $attempts
 * @property array<array-key, mixed>|null $data
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Model|\Eloquent $scoreable
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ScoreFactory factory($count = null, $state = [])
 * @method static Builder<static>|Score newModelQuery()
 * @method static Builder<static>|Score newQuery()
 * @method static Builder<static>|Score query()
 * @method static Builder<static>|Score whereAttempts($value)
 * @method static Builder<static>|Score whereCreatedAt($value)
 * @method static Builder<static>|Score whereData($value)
 * @method static Builder<static>|Score whereId($value)
 * @method static Builder<static>|Score whereIsResolved($value)
 * @method static Builder<static>|Score whereScore($value)
 * @method static Builder<static>|Score whereScoreableId($value)
 * @method static Builder<static>|Score whereScoreableType($value)
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
		'scoreable_id',
		'scoreable_type'
	];

	protected $casts = [
		'data'        => 'array',
		'is_resolved' => 'boolean'
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
