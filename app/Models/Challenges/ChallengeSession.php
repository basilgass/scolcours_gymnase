<?php
	
	namespace App\Models\Challenges;
	
	use App\Models\Challenge;
	use App\Models\User;
	use Illuminate\Database\Eloquent\Model;
	
	/**
 * App\Models\Challenges\ChallengeSession
 *
 * @property int $id
 * @property int $challenge_id
 * @property int $user_id
 * @property string $token
 * @property int $open
 * @property int $duration
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read User $admin
 * @property-read Challenge $challenge
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Challenges\ChallengeUser[] $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession query()
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession whereChallengeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession whereOpen($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeSession whereUserId($value)
 * @mixin \Eloquent
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