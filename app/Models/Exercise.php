<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Exercise
 *
 * @property int $id
 * @property int $chapter_id
 * @property int $position
 * @property int $active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Block[] $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Chapter $chapter
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Question[] $questions
 * @property-read int|null $questions_count
 * @method static \Database\Factories\ExerciseFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|Exercise newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Exercise newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Exercise query()
 * @method static \Illuminate\Database\Eloquent\Builder|Exercise whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exercise whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exercise whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exercise whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exercise wherePosition($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exercise whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Exercise extends Model
{
	use HasFactory;

	protected $guarded = [];
	protected $with = ['blocks', 'questions'];

	public function chapter(): \Illuminate\Database\Eloquent\Relations\BelongsTo
	{
		return $this->belongsTo(Chapter::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable');
	}

	public function questions()
	{
		return $this->hasMany(Question::class);
	}
}
