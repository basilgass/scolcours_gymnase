<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\PostAnswer
 *
 * @property int $id
 * @property int $post_id
 * @property string $body
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Illustration[] $illustrations
 * @property-read int|null $illustrations_count
 * @property-read \App\Models\Post $post
 * @method static \Illuminate\Database\Eloquent\Builder|PostAnswer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostAnswer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostAnswer query()
 * @method static \Illuminate\Database\Eloquent\Builder|PostAnswer whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostAnswer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostAnswer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostAnswer wherePostId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostAnswer whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PostAnswer extends Model
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
