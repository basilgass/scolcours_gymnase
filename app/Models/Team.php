<?php

namespace App\Models;

use App\Models\Calendars\TeamCalendar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Team
 *
 * @property int $id
 * @property string $name
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, TeamCalendar> $calendars
 * @property-read int|null $calendars_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Course> $courses
 * @property-read int|null $courses_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Evaluation> $evaluation
 * @property-read int|null $evaluation_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LessonCalendar> $lesson_calendars
 * @property-read int|null $lesson_calendars_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team active()
 * @method static \Database\Factories\TeamFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Team whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Team extends Model
{
	use HasFactory;

	protected $with = [];
	protected $guarded = [];

	protected $attributes = [
		'active' => false,
	];

	protected $casts = [
		'active' => "boolean",
	];

	public function users(): BelongsToMany
	{
		return $this->belongsToMany(User::class)->orderBy('name')->orderBy('firstname');
	}

	public function courses(): BelongsToMany
	{
		return $this->belongsToMany(Course::class);
	}

	public function evaluation(): BelongsToMany
	{
		return $this->belongsToMany(Evaluation::class);
	}

	public function calendars(): HasMany
	{
		return $this->hasMany(TeamCalendar::class);
	}

	public function lesson_calendars(): HasMany
	{
		return $this
			->hasMany(LessonCalendar::class)
			->where('team_id', $this->id);
	}

	public function scopeActive($query)
	{
		return $query->where('active', true);
	}
}
