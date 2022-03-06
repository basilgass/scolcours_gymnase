<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\PostComponent
 *
 * @property int $id
 * @property int $post_id
 * @property string $name
 * @property string|null $component
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $parameters
 * @property-read \App\Models\Post $post
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent query()
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent whereComponent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent whereParameters($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent wherePostId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostComponent whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PostComponent extends Model
{
    use HasFactory;
	
	public function post()
	{
		return $this->belongsTo(Post::class);
	}
}
