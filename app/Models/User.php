<?php

namespace App\Models;

use App\Models\Challenges\ChallengeSession;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property int|null $team_id
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|ChallengeSession[] $challenges
 * @property-read int|null $challenges_count
 * @property-read Collection|\App\Models\Chapter[] $chapters
 * @property-read int|null $chapters_count
 * @property-read mixed $admin
 * @property-read DatabaseNotificationCollection|DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection|\App\Models\Question[] $questions
 * @property-read int|null $questions_count
 * @property-read Collection|\App\Models\Score[] $scores
 * @property-read int|null $scores_count
 * @property-read \App\Models\Team|null $team
 * @property-read Collection|PersonalAccessToken[] $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory(...$parameters)
 * @method static Builder|User newModelQuery()
 * @method static Builder|User newQuery()
 * @method static Builder|User query()
 * @method static Builder|User whereCreatedAt($value)
 * @method static Builder|User whereEmail($value)
 * @method static Builder|User whereEmailVerifiedAt($value)
 * @method static Builder|User whereId($value)
 * @method static Builder|User whereName($value)
 * @method static Builder|User wherePassword($value)
 * @method static Builder|User whereRememberToken($value)
 * @method static Builder|User whereTeamId($value)
 * @method static Builder|User whereUpdatedAt($value)
 * @mixin Eloquent
 */
class User extends Authenticatable
{
	use HasApiTokens, HasFactory, Notifiable;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'name',
		'email',
		'password',
	];

	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var array
	 */
	protected $hidden = [
		'password',
		'remember_token',
	];

	/**
	 * The attributes that should be cast.
	 *
	 * @var array
	 */
	protected $casts = [
		'email_verified_at' => 'datetime',
	];

	protected $with = ['team'];

	public function team()
	{
		return $this->belongsTo(Team::class);
	}

	public function challenges()
	{
		// TODO: challenge session is disabled !
		return $this->hasMany(ChallengeSession::class);
	}

	public function questions()
	{
		return $this->belongsToMany(Question::class)
			->withTimestamps()
			->withPivot('result', 'answer', 'attempts');
	}

	public function scores()
	{
		return $this->hasMany(Score::class);
	}

	public function chapters()
	{
		return $this->belongsToMany(Chapter::class)
			->withPivot('open', 'post_id', 'updated_at')
			->orderBy('pivot_updated_at', 'desc');
	}

	public function getAdminAttribute()
	{
		return $this->email === 'basil@scolcours.ch' or $this->email === 'alyssia@famillegass.ch';
	}
}
