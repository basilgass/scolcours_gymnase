<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * @property int $id
 * @property int $team_id
 * @property int $lesson_id
 * @property \Illuminate\Support\Carbon|null $scheduled_at
 * @property bool $homework
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Block> $blocks
 * @property-read int|null $blocks_count
 * @property-read \App\Models\Lesson $lesson
 * @property-read \App\Models\Team $team
 * @method static \Database\Factories\LessonCalendarFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar whereHomework($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar whereLessonId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar whereScheduledAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar whereTeamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LessonCalendar whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class LessonCalendar extends Model
{
	use HasFactory;

	protected $fillable = [
		'team_id',
		'lesson_id',
		'scheduled_at',
		'homework'
	];

	protected function casts(): array
	{
		return [
			'scheduled_at' => 'datetime',
			'homework'     => 'boolean'
		];
	}

	public function blocks(): MorphMany
	{
		return $this
			->morphMany(Block::class, 'blockable')
			->orderBy('order')
			->orderBy('id');

	}

	public function team(): BelongsTo
	{
		return $this->belongsTo(Team::class);
	}

	public function lesson(): BelongsTo
	{
		return $this->belongsTo(Lesson::class);
	}
}
