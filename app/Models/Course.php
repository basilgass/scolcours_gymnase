<?php

namespace App\Models;

use App\Traits\HasUrlTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property int|null $theme_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Lesson> $lessons
 * @property-read int|null $lessons_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Team> $teams
 * @property-read int|null $teams_count
 * @property-read \App\Models\Theme|null $theme
 * @property-read mixed $url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Database\Factories\CourseFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereThemeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Course extends Model
{
	use HasFactory;
	use HasUrlTrait;

	protected $with = ['blocks', 'lessons'];
	protected $appends = ['url'];

	protected $fillable = [
		"title",
		"slug",
		"theme_id",
	];

	public function blocks(): MorphMany
	{
		return $this
			->morphMany(Block::class, 'blockable')
			->orderBy('order')
			->orderBy('id');
	}

	public function lessons(): HasMany|Course
	{
		return $this->hasMany(Lesson::class)
			->orderBy('order')
			->orderBy('id');
	}

	public function theme(): BelongsTo
	{
		return $this->belongsTo(Theme::class);
	}

	public function users()
	{
		return $this->belongsToMany(User::class);
	}

	public function teams()
	{
		return $this->belongsToMany(Team::class);
	}
}
