<?php

namespace App\Models\Calendars;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int|null $week
 * @property \Illuminate\Support\Carbon $day
 * @property bool $school
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\Calendars\SchoolCalendarFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolCalendar newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolCalendar newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolCalendar query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolCalendar whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolCalendar whereDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolCalendar whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolCalendar whereSchool($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolCalendar whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolCalendar whereWeek($value)
 * @mixin \Eloquent
 */
class SchoolCalendar extends Model
{
	use HasFactory;

	protected $fillable = [
		'week',
		'day',
		'school',
	];

	protected function casts(): array
	{
		return [
			'day'    => 'date',
			'school' => 'boolean',
		];
	}
}
