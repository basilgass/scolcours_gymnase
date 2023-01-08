<?php

namespace App\Models;

use Database\Factories\ChapterFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use URL;

/**
 * App\Models\Chapter
 *
 * @property int $id
 * @property int $theme_id
 * @property string $slug
 * @property string $title
 * @property int $active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|Block[] $blocks
 * @property-read int|null $blocks_count
 * @property-read Collection|Challenge[] $challenges
 * @property-read int|null $challenges_count
 * @property-read Collection|Formula[] $formulas
 * @property-read int|null $formulas_count
 * @property-read Collection|Post[] $posts
 * @property-read int|null $posts_count
 * @property-read Collection|Question[] $questions
 * @property-read int|null $questions_count
 * @property-read Theme $theme
 * @method static ChapterFactory factory(...$parameters)
 * @method static Builder|Chapter newModelQuery()
 * @method static Builder|Chapter newQuery()
 * @method static Builder|Chapter query()
 * @method static Builder|Chapter whereActive($value)
 * @method static Builder|Chapter whereCreatedAt($value)
 * @method static Builder|Chapter whereId($value)
 * @method static Builder|Chapter whereSlug($value)
 * @method static Builder|Chapter whereThemeId($value)
 * @method static Builder|Chapter whereTitle($value)
 * @method static Builder|Chapter whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Chapter extends Model
{
	use HasFactory;

	protected $guarded = [];

	// removed the theme:id,slug
	protected $with = ['posts','formulas', 'challenges'];

	public function theme(): \Illuminate\Database\Eloquent\Relations\BelongsTo
	{
		return $this->belongsTo(Theme::class);
	}

	public function blocks()
	{
		return $this->morphMany(Block::class, 'blockable');
	}

	public function posts(): HasMany
	{
		return $this->hasMany(Post::class)->orderBy('order')->orderBy('id');
	}

	public function formulas(): HasMany
	{
		return $this->hasMany(Formula::class)->orderBy('order')->orderBy('id');
	}

	public function challenges(): HasMany
	{
		return $this->hasMany(Challenge::class);
	}

	public function questions()
	{
		return $this->hasManyThrough(Question::class, Post::class);
	}

	public function users()
	{
		return $this->belongsToMany(User::class);
	}

//
//	public function questions()
//	{
//		return $this->hasManyThrough(Question::class, Exercise::class);
//	}
	protected function url(): Attribute
	{
		return Attribute::make(
			get: fn() => URL::route('theme.chapter', [$this->theme->slug, $this->slug], false)
		);
	}

	// TODO: Maybe remove this one to include in the Block element.
	protected function component(): Attribute{
		if($this->theme === null || $this->slug===null){
			$path = false;
		}else {
			$path = $this->theme->slug . '/' . $this->slug;
		}

		if(Storage::disk('chapters')->exists($path.'.vue')){
			$component = 'Chapters/' . $path;
		}else{
			$component = false;
		}

		return Attribute::make(
			get: fn() => $component
		);
	}

}
