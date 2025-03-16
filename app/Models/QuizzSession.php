<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\QuizzSession
 *
 * @property int $id
 * @property int $quizz_id
 * @property string $shortcode
 * @property int $enable
 * @property int $index
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read mixed $question
 * @property-read string $status
 * @property-read mixed $total
 * @property-read \App\Models\Quizz $quizz
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession whereEnable($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession whereIndex($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession whereQuizzId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession whereShortcode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QuizzSession whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class QuizzSession extends Model
{
	use HasFactory;

	protected $guarded = [];

	protected $appends = ['status', 'total'];

	public function quizz()
	{
		return $this->belongsTo(Quizz::class);
	}

	public function users()
	{
		return $this->belongsToMany(User::class, 'quizz_session_user')
			->withTimestamps();
//			->withPivot('result', 'answer', 'attempts');
//		return $this->morphedByMany(User::class, Question::class);
	}

	public function getQuestionAttribute()
	{
		if ($this->index > 0 && $this->index <= count($this->quizz->questions)) {
			return $this->quizz->questions[$this->index-1];
		}

		return null;
	}

	public function getTotalAttribute()
	{
		return count($this->quizz->questions);
	}

	public function getStatusAttribute(): string
	{
		// Le quizz n'a pas commencé
		if($this->index===0){return 'intro';}

		// Le quizz est terminé
		if($this->index>=count($this->quizz->questions)+1){return 'outro';}

		// Le quizz est en cours.
		if(\Auth::user()) {
			// Determine if the current question has already been answered.
			if ($this->question->users->where('id', \Auth::id())->first()?->pivot->attempts>0) {
				return "wait";
			}

			return 'question';
		}

		// L'utilisateur n'est pas connecté
		return "l'utilisateur n'est pas connecté";
	}
}
