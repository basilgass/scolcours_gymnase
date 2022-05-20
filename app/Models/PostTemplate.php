<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\PostTemplate
 *
 * @property int $id
 * @property string $name
 * @property string $component
 * @property int $parameters
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|\App\Models\Post[] $posts
 * @property-read int|null $posts_count
 * @method static Builder|PostTemplate newModelQuery()
 * @method static Builder|PostTemplate newQuery()
 * @method static Builder|PostTemplate query()
 * @method static Builder|PostTemplate whereComponent($value)
 * @method static Builder|PostTemplate whereCreatedAt($value)
 * @method static Builder|PostTemplate whereId($value)
 * @method static Builder|PostTemplate whereName($value)
 * @method static Builder|PostTemplate whereParameters($value)
 * @method static Builder|PostTemplate whereUpdatedAt($value)
 * @mixin Eloquent
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
