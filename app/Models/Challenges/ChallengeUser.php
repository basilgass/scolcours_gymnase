<?php

	namespace App\Models\Challenges;

	use Eloquent;
	use Illuminate\Database\Eloquent\Builder;
	use Illuminate\Database\Eloquent\Model;
	use Illuminate\Support\Carbon;

	/**
 * App\Models\Challenges\ChallengeUser
 *
 * @property int $id
 * @property int $challenge_session_id
 * @property string $token
 * @property int $score
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\Challenges\ChallengeSession|null $session
 * @method static Builder|ChallengeUser newModelQuery()
 * @method static Builder|ChallengeUser newQuery()
 * @method static Builder|ChallengeUser query()
 * @method static Builder|ChallengeUser whereChallengeSessionId($value)
 * @method static Builder|ChallengeUser whereCreatedAt($value)
 * @method static Builder|ChallengeUser whereId($value)
 * @method static Builder|ChallengeUser whereScore($value)
 * @method static Builder|ChallengeUser whereToken($value)
 * @method static Builder|ChallengeUser whereUpdatedAt($value)
 * @mixin Eloquent
 */
class ChallengeUser extends Model
	{
		protected $guarded=[];

		public function session()
		{
			return $this->belongsTo(ChallengeSession::class);
		}
	}
