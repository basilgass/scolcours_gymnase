<?php

namespace App\Models;

use App\Traits\HasScoresTrait;
use App\Traits\HasUrlTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property int $id
 * @property int $course_id
 * @property string|null $requires
 * @property string|null $label
 * @property int|null $order
 * @property string $lessonable_type
 * @property int $lessonable_id
 * @property array<array-key, mixed>|null $scoreRules
 * @property array<array-key, mixed>|null $parameters
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\LessonCalendar> $calendars
 * @property-read int|null $calendars_count
 * @property-read \App\Models\Course $course
 * @property-read Model|\Eloquent $lessonable
 * @property-read \App\Models\Score|null $scoreForAuth
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Score> $scores
 * @property-read int|null $scores_count
 * @property-read mixed $url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Database\Factories\LessonFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereLessonableId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereLessonableType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereParameters($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereRequires($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereScoreRules($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Lesson whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Lesson extends Model
{
	use HasFactory;
	use HasUrlTrait;
	use HasScoresTrait;

	protected $fillable = [
		"label",
		"requires",
		"order",
		"scoreRules",
		"parameters",
		"lessonable_type",
		"lessonable_id"
	];
	protected $appends = ['url'];

	protected $with = ['calendars'];

	protected function casts(): array
	{
		return [
			'scoreRules'   => 'array',
			'parameters'   => 'array',
			'scheduled_at' => 'datetime'
		];
	}

	public function lessonable(): MorphTo
	{
		return $this->morphTo();
	}

	public function course(): BelongsTo
	{
		return $this->belongsTo(Course::class);
	}

	public function calendars(): HasMany
	{
		return $this->hasMany(LessonCalendar::class);
	}

	public function blocks(): MorphMany
	{
		return $this
			->morphMany(Block::class, 'blockable')
			->orderBy('order')
			->orderBy('id');
	}

}
