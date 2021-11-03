<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Exercise
 *
 * @property int $id
 * @property int $chapter_id
 * @property string $title
 * @property string $body
 * @property string $answer
 * @property string|null $explanation
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Chapter $chapter
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Illustration[] $illustrations
 * @property-read int|null $illustrations_count
 * @method static \Database\Factories\ExerciseFactory factory(...$parameters)
 * @method static Builder|Exercise newModelQuery()
 * @method static Builder|Exercise newQuery()
 * @method static Builder|Exercise query()
 * @method static Builder|Exercise whereAnswer($value)
 * @method static Builder|Exercise whereBody($value)
 * @method static Builder|Exercise whereChapterId($value)
 * @method static Builder|Exercise whereCreatedAt($value)
 * @method static Builder|Exercise whereExplanation($value)
 * @method static Builder|Exercise whereId($value)
 * @method static Builder|Exercise whereTitle($value)
 * @method static Builder|Exercise whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Exercise extends Model
{
	use HasFactory;
	protected $guarded=[];
	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function illustrations(){
		return $this->hasMany(Illustration::class);
	}
}
