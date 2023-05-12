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
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession query()
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession whereEnable($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession whereIndex($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession whereQuizzId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession whereShortcode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuizzSession whereUpdatedAt($value)
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

		if($this->index===0){return 'intro';}
		if($this->index===count($this->quizz->questions)+1){return 'outro';}

		if(\Auth::user()) {
			// Determine if the current question has already been answered.
			if (count($this->question->userAnswers())>0) {
				return "wait";
			}
		}

		return 'question';
	}
}
