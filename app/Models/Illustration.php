<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Illustration
 *
 * @property int $id
 * @property string $title
 * @property string $type
 * @property string $code
 * @property string $parameters
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Post[] $posts
 * @property-read int|null $posts_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\PostWalkthrough[] $walkthroughs
 * @property-read int|null $walkthroughs_count
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration query()
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereParameters($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Illustration whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Illustration extends Model
{
	protected $guarded = [];

	public function posts()
	{
		return $this->morphedByMany(Post::class, 'illustrationable');
	}

	public function walkthroughs()
	{
		return $this->morphedByMany(PostWalkthrough::class, 'illustrationable');
	}
}
