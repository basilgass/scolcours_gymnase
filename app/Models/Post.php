<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * App\Models\Post
 *
 * @property int $id
 * @property int $chapter_id
 * @property int $post_template_id
 * @property string|null $post_template_params
 * @property string|null $title
 * @property string $body
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read PostAnswer|null $answer
 * @property-read Chapter $chapter
 * @property-read PostComponent|null $component
 * @property-read Collection|Illustration[] $illustrations
 * @property-read int|null $illustrations_count
 * @property-read PostTemplate|null $template
 * @property-read Collection|PostWalkthrough[] $walkthrough
 * @property-read int|null $walkthrough_count
 * @method static Builder|Post newModelQuery()
 * @method static Builder|Post newQuery()
 * @method static Builder|Post query()
 * @method static Builder|Post whereBody($value)
 * @method static Builder|Post whereChapterId($value)
 * @method static Builder|Post whereCreatedAt($value)
 * @method static Builder|Post whereId($value)
 * @method static Builder|Post wherePostTemplateId($value)
 * @method static Builder|Post wherePostTemplateParams($value)
 * @method static Builder|Post whereTitle($value)
 * @method static Builder|Post whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Post extends Model
{
    use HasFactory;

	protected $with = ['answer', 'illustrations', 'walkthrough', 'component'];

	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
	}

	public function template()
	{
		return $this->belongsTo(PostTemplate::class, 'post_template_id');
	}

	public function illustrations()
	{
		return $this->morphToMany(Illustration::class, 'illustrationable');
	}

	public function walkthrough()
	{
		return $this->hasMany(PostWalkthrough::class);
	}

	public function answer()
	{
		return $this->hasOne(PostAnswer::class);
	}

	public function component()
	{
		return $this->hasOne(PostComponent::class);
	}
}
