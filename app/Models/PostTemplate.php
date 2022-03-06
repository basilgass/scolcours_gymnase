<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\PostTemplate
 *
 * @property int $id
 * @property int $post_id
 * @property string $name
 * @property string $component
 * @property string $parameters
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Post $post
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate query()
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereComponent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereParameters($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate wherePostId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PostTemplate extends Model
{
    use HasFactory;
	
	public function post()
	{
		return $this->belongsTo(Post::class);
	}
}
