<?php

namespace App\Models;

use Database\Factories\ChapterFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use URL;

/**
 * App\Models\Chapter
 *
 * @property int $id
 * @property int $theme_id
 * @property string $slug
 * @property string $title
 * @property string $body
 * @property int $active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Challenge[] $challenges
 * @property-read int|null $challenges_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Formula[] $formulas
 * @property-read int|null $formulas_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Post[] $posts
 * @property-read int|null $posts_count
 * @property-read \App\Models\Theme $theme
 * @method static \Database\Factories\ChapterFactory factory(...$parameters)
 * @method static Builder|Chapter newModelQuery()
 * @method static Builder|Chapter newQuery()
 * @method static Builder|Chapter query()
 * @method static Builder|Chapter whereActive($value)
 * @method static Builder|Chapter whereBody($value)
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

	protected $with = ['theme:id,slug'];

	public function theme(): \Illuminate\Database\Eloquent\Relations\BelongsTo
	{
		return $this->belongsTo(Theme::class);
	}

	public function posts(): \Illuminate\Database\Eloquent\Relations\HasMany
	{
		return $this->hasMany(Post::class);
	}

	public function formulas(): \Illuminate\Database\Eloquent\Relations\HasMany
	{
		return $this->hasMany(Formula::class);
	}

	public function challenges(): \Illuminate\Database\Eloquent\Relations\HasMany
	{
		return $this->hasMany(Challenge::class);
	}

	protected function url(): Attribute
	{
		return Attribute::make(
			get: fn() => URL::route('theme.chapter', [$this->theme->slug, $this->slug], false)
		);
	}

}
