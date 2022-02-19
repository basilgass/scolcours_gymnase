<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Illustration
 *
 * @property int $id
 * @property int $exercise_id
 * @property string $url
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Exercise $exercise
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration query()
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereExerciseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereUrl($value)
 * @mixin \Eloquent
 */
class Illustration extends Model
{
	protected $guarded = [];
	
	public function posts()
	{
		return $this->morphedByMany(Post::class, 'illustrationable');
	}

}
