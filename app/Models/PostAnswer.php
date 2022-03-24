<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\PostAnswer
 *
 * @property int $id
 * @property int $post_id
 * @property string $body
 * @property string|null $checker
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|Illustration[] $illustrations
 * @property-read int|null $illustrations_count
 * @property-read Post $post
 * @method static Builder|PostAnswer newModelQuery()
 * @method static Builder|PostAnswer newQuery()
 * @method static Builder|PostAnswer query()
 * @method static Builder|PostAnswer whereBody($value)
 * @method static Builder|PostAnswer whereChecker($value)
 * @method static Builder|PostAnswer whereCreatedAt($value)
 * @method static Builder|PostAnswer whereId($value)
 * @method static Builder|PostAnswer wherePostId($value)
 * @method static Builder|PostAnswer whereUpdatedAt($value)
 * @mixin Eloquent
 */
class PostAnswer extends Model
{
    use HasFactory;

	protected $guarded=[];

	public function post()
	{
		return $this->belongsTo(Post::class);
	}

	public function illustrations()
	{
		return $this->morphToMany(Illustration::class, 'illustrationable');
	}
}
