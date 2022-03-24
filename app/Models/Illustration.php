<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Illustration
 *
 * @property int $id
 * @property string $title
 * @property string $type
 * @property string $code
 * @property string $parameters
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|Post[] $posts
 * @property-read int|null $posts_count
 * @property-read Collection|PostWalkthrough[] $walkthroughs
 * @property-read int|null $walkthroughs_count
 * @method static Builder|Illustration newModelQuery()
 * @method static Builder|Illustration newQuery()
 * @method static Builder|Illustration query()
 * @method static Builder|Illustration whereCode($value)
 * @method static Builder|Illustration whereCreatedAt($value)
 * @method static Builder|Illustration whereId($value)
 * @method static Builder|Illustration whereParameters($value)
 * @method static Builder|Illustration whereTitle($value)
 * @method static Builder|Illustration whereType($value)
 * @method static Builder|Illustration whereUpdatedAt($value)
 * @mixin Eloquent
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
