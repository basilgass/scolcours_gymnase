<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\PostComponent
 *
 * @property int $id
 * @property int $post_id
 * @property string $name
 * @property string $component
 * @property string|null $parameters
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Post $post
 * @method static Builder|PostComponent newModelQuery()
 * @method static Builder|PostComponent newQuery()
 * @method static Builder|PostComponent query()
 * @method static Builder|PostComponent whereComponent($value)
 * @method static Builder|PostComponent whereCreatedAt($value)
 * @method static Builder|PostComponent whereId($value)
 * @method static Builder|PostComponent whereName($value)
 * @method static Builder|PostComponent whereParameters($value)
 * @method static Builder|PostComponent wherePostId($value)
 * @method static Builder|PostComponent whereUpdatedAt($value)
 * @mixin Eloquent
 */
class PostComponent extends Model
{
    use HasFactory;

	public function post()
	{
		return $this->belongsTo(Post::class);
	}
}
