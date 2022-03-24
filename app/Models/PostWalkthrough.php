<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\PostWalkthrough
 *
 * @property int $id
 * @property int $post_id
 * @property int $order
 * @property string $step
 * @property string|null $resolution
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Illustration[] $illustrations
 * @property-read int|null $illustrations_count
 * @property-read \App\Models\Post $post
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough query()
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough wherePostId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough whereResolution($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough whereStep($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostWalkthrough whereUpdatedAt($value)
 * @mixin \Eloquent
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
