<?php

	namespace App\Models\Challenges;

	use App\Models\Challenge;
	use App\Models\User;
	use Eloquent;
	use Illuminate\Database\Eloquent\Builder;
	use Illuminate\Database\Eloquent\Collection;
	use Illuminate\Database\Eloquent\Model;
	use Illuminate\Support\Carbon;

	/**
 * App\Models\Challenges\ChallengeSession
 *
 * @property int $id
 * @property int $challenge_id
 * @property int $user_id
 * @property string $token
 * @property int $open
 * @property int $duration
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $admin
 * @property-read Challenge $challenge
 * @property-read Collection|ChallengeUser[] $users
 * @property-read int|null $users_count
 * @method static Builder|ChallengeSession newModelQuery()
 * @method static Builder|ChallengeSession newQuery()
 * @method static Builder|ChallengeSession query()
 * @method static Builder|ChallengeSession whereChallengeId($value)
 * @method static Builder|ChallengeSession whereCreatedAt($value)
 * @method static Builder|ChallengeSession whereDuration($value)
 * @method static Builder|ChallengeSession whereId($value)
 * @method static Builder|ChallengeSession whereOpen($value)
 * @method static Builder|ChallengeSession whereToken($value)
 * @method static Builder|ChallengeSession whereUpdatedAt($value)
 * @method static Builder|ChallengeSession whereUserId($value)
 * @mixin Eloquent
 */
class ChallengeSession extends Model
	{
		protected $guarded=[];

		public function challenge()
		{
			return $this->belongsTo(Challenge::class);
		}

		public function admin()
		{
			return $this->belongsTo(User::class);
		}

		public function users()
		{
			return $this->hasMany(ChallengeUser::class);
		}
	}
