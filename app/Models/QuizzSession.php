<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizzSession extends Model
{
	use HasFactory;

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
