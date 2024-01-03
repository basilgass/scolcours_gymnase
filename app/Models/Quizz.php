<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Quizz
 *
 * @property int $id
 * @property int|null $chapter_id
 * @property string $title
 * @property string $body
 * @property string $outro
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Chapter|null $chapter
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\QuizzSession> $sessions
 * @property-read int|null $sessions_count
 * @property-read \App\Models\Theme|null $theme
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz query()
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz whereOutro($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Quizz whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Quizz extends Model
{
    use HasFactory;

	protected $guarded=[];
	public function questions()
	{
		return $this->morphMany(Question::class, 'questionable')->orderBy('order')->orderBy('id');
	}

	public function sessions()
	{
		return $this->hasMany(QuizzSession::class);
	}

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function theme()
	{
		return $this->hasOneThrough(Theme::class, Chapter::class, 'id', 'id', 'chapter_id', 'id');
	}
}
