<?php

namespace App\Models;

use App\Traits\HasQuestionsTrait;
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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz whereOutro($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Quizz whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Quizz extends Model
{
    use HasQuestionsTrait;

	protected $guarded=[];


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
