<?php
	
	namespace App\Models\Challenges;
	
	use Illuminate\Database\Eloquent\Model;
	
	/**
 * App\Models\Challenges\ChallengeUser
 *
 * @property int $id
 * @property int $challenge_session_id
 * @property string $token
 * @property int $score
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Challenges\ChallengeSession|null $session
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeUser query()
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeUser whereChallengeSessionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeUser whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeUser whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeUser whereScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeUser whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChallengeUser whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ChallengeUser extends Model
	{
		protected $guarded=[];
		
		public function session()
		{
			return $this->belongsTo(ChallengeSession::class);
		}
	}