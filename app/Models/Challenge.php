<?php
	
	namespace App\Models;
	
	use App\Models\Challenges\ChallengeSession;
	use Illuminate\Database\Eloquent\Model;
	
	/**
 * App\Models\Challenge
 *
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $running
 * @property-read \Illuminate\Database\Eloquent\Collection|ChallengeSession[] $sessions
 * @property-read int|null $sessions_count
 * @method static \Illuminate\Database\Eloquent\Builder|Challenge newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Challenge newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Challenge query()
 * @method static \Illuminate\Database\Eloquent\Builder|Challenge whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Challenge whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Challenge whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Challenge whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Challenge whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Challenge extends Model
	{
		protected $guarded=[];
		
		public function sessions()
		{
			return $this->hasMany(ChallengeSession::class);
		}
		
		public function getRunningAttribute()
		{
			return $this->sessions->where('open', 'is', true);
		}
	}