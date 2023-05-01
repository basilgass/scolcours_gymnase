<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quizz extends Model
{
    use HasFactory;

	public function questions()
	{
		return $this->morphMany(Question::class, 'questionable')->orderBy('order')->orderBy('id');
	}

	public function sessions()
	{
		return $this->hasMany(QuizzSession::class);
	}

}
