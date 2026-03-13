<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
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
 * @property string $firstname
 * @property string $email
 * @property string|null $role
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, \App\Models\Card> $cards
 * @property-read int|null $cards_count
 * @property-read Collection<int, \App\Models\Chapter> $chapters
 * @property-read int|null $chapters_count
 * @property-read Collection<int, \App\Models\UserDeck> $decks
 * @property-read int|null $decks_count
 * @property-read mixed $admin
 * @property-read DatabaseNotificationCollection<int, DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read Collection<int, \App\Models\QuizzSession> $quizz_sessions
 * @property-read int|null $quizz_sessions_count
 * @property-read Collection<int, \App\Models\Score> $scores
 * @property-read int|null $scores_count
 * @property-read Collection<int, \App\Models\Team> $teams
 * @property-read int|null $teams_count
 * @property-read Collection<int, PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static Builder<static>|User newModelQuery()
 * @method static Builder<static>|User newQuery()
 * @method static Builder<static>|User query()
 * @method static Builder<static>|User whereCreatedAt($value)
 * @method static Builder<static>|User whereEmail($value)
 * @method static Builder<static>|User whereEmailVerifiedAt($value)
 * @method static Builder<static>|User whereFirstname($value)
 * @method static Builder<static>|User whereId($value)
 * @method static Builder<static>|User whereName($value)
 * @method static Builder<static>|User wherePassword($value)
 * @method static Builder<static>|User whereRememberToken($value)
 * @method static Builder<static>|User whereRole($value)
 * @method static Builder<static>|User whereUpdatedAt($value)
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
		'firstname',
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


	protected $with = [];

	public function teams(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
	{
		return $this->belongsToMany(Team::class);
	}

	public function questions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
	{
		return $this
			->belongsToMany(Question::class)
			->withTimestamps();
		//			->withPivot('result', 'answer', 'attempts');
	}

	// TODO: user->cards encore utile ?
	public function cards(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
	{
		return $this
			->belongsToMany(Card::class)
			->withTimestamps()
			->withPivot('success');
	}

	public function quizz_sessions(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
	{
		return $this
			->belongsToMany(QuizzSession::class)
			->withTimestamps();
	}

	public function scores(): User|Builder|\Illuminate\Database\Eloquent\Relations\HasMany
	{
		return $this->hasMany(Score::class);
	}

	public function admin(): Attribute
	{
		return Attribute::get(function () {
			return $this->role === 'admin';
		});
	}

	public function courses(): Attribute
	{
		return Attribute::get(function () {
			return $this->teams->flatMap->courses->unique('id');
		});
	}

	public function teamEvaluationsQuery()
	{
		$teamIds = $this->teams()->pluck('teams.id');

		return Evaluation::query()
		                 ->whereHas('teams', function (Builder $q) use ($teamIds) {
			                 $q->whereIn('teams.id', $teamIds);
		                 });
	}

}
