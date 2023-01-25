<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
 * @property-read Collection|\App\Models\Challenge[] $challenges
 * @property-read int|null $challenges_count
 * @property-read Model|\Eloquent $scoreable
 * @property-read Collection|\App\Models\User[] $users
 * @property-read int|null $users_count
 * @method static Builder|Score newModelQuery()
 * @method static Builder|Score newQuery()
 * @method static Builder|Score query()
 * @method static Builder|Score whereCreatedAt($value)
 * @method static Builder|Score whereId($value)
 * @method static Builder|Score whereLevel($value)
 * @method static Builder|Score whereScore($value)
 * @method static Builder|Score whereScoreableId($value)
 * @method static Builder|Score whereScoreableType($value)
 * @method static Builder|Score whereStars($value)
 * @method static Builder|Score whereUpdatedAt($value)
 * @method static Builder|Score whereUserId($value)
 * @mixin Eloquent
 */
class Score extends Model
{
    use HasFactory;

	protected $guarded=[];

	public function users()
	{
		return $this->belongsToMany(User::class);
	}

	public function challenges()
	{
		return $this->belongsToMany(Challenge::class);
	}

	public function scoreable(): \Illuminate\Database\Eloquent\Relations\MorphTo
	{
		return $this->morphTo();
	}
}
