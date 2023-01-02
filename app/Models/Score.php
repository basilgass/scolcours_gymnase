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
 * @property int $challenge_id
 * @property int $score
 * @property int $stars
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|Challenge[] $challenges
 * @property-read int|null $challenges_count
 * @property-read Collection|User[] $users
 * @property-read int|null $users_count
 * @method static Builder|Score newModelQuery()
 * @method static Builder|Score newQuery()
 * @method static Builder|Score query()
 * @method static Builder|Score whereChallengeId($value)
 * @method static Builder|Score whereCreatedAt($value)
 * @method static Builder|Score whereId($value)
 * @method static Builder|Score whereScore($value)
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
}
