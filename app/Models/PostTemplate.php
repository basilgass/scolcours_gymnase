<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\PostTemplate
 *
 * @property int $id
 * @property string $name
 * @property string $component
 * @property int $parameters
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Post[] $posts
 * @property-read int|null $posts_count
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate query()
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereComponent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereParameters($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PostTemplate whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PostTemplate extends Model
{
    use HasFactory;
		protected $guarded=[];

	public function posts()
	{
		return $this->hasMany(Post::class);
	}
}
