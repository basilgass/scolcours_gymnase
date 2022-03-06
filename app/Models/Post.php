<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Post
 *
 * @property int $id
 * @property int $chapter_id
 * @property string $title
 * @property string $body
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\PostAnswer|null $answer
 * @property-read \App\Models\Chapter $chapter
 * @property-read \App\Models\PostComponent|null $component
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Illustration[] $illustrations
 * @property-read int|null $illustrations_count
 * @property-read \App\Models\PostTemplate|null $template
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\PostWalkthrough[] $walkthrough
 * @property-read int|null $walkthrough_count
 * @method static \Illuminate\Database\Eloquent\Builder|Post newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Post newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Post query()
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereChapterId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Post whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Post extends Model
{
    use HasFactory;
	
	protected $with = ['answer', 'illustrations', 'walkthrough', 'component'];
	
	public function chapter()
	{
		return $this->belongsTo(Chapter::class);
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
	
	public function template()
	{
		return $this->hasOne(PostTemplate::class);
	}
	public function component()
	{
		return $this->hasOne(PostComponent::class);
	}
}
