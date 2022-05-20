<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\PostWalkthrough
 *
 * @property int $id
 * @property int $post_id
 * @property int $order
 * @property string $step
 * @property string|null $resolution
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|\App\Models\Illustration[] $illustrations
 * @property-read int|null $illustrations_count
 * @property-read \App\Models\Post $post
 * @method static Builder|PostWalkthrough newModelQuery()
 * @method static Builder|PostWalkthrough newQuery()
 * @method static Builder|PostWalkthrough query()
 * @method static Builder|PostWalkthrough whereCreatedAt($value)
 * @method static Builder|PostWalkthrough whereId($value)
 * @method static Builder|PostWalkthrough whereOrder($value)
 * @method static Builder|PostWalkthrough wherePostId($value)
 * @method static Builder|PostWalkthrough whereResolution($value)
 * @method static Builder|PostWalkthrough whereStep($value)
 * @method static Builder|PostWalkthrough whereUpdatedAt($value)
 * @mixin Eloquent
 */
class PostWalkthrough extends Model
{
    use HasFactory;


	public function post()
	{
		return $this->belongsTo(Post::class);
	}

	public function illustrations()
	{
		return $this->morphToMany(Illustration::class, 'illustrationable');
	}
}
