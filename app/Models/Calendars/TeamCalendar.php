<?php

namespace App\Models\Calendars;

use App\Models\SchoolTimetable;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $team_id
 * @property int $day
 * @property int $school_timetable_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Team $team
 * @property-read SchoolTimetable $schoolTimetable
 * @method static \Database\Factories\Calendars\TeamCalendarFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TeamCalendar newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TeamCalendar newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TeamCalendar query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TeamCalendar whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TeamCalendar whereDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TeamCalendar whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TeamCalendar whereTeamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TeamCalendar whereTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TeamCalendar whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class TeamCalendar extends Model
{
	use HasFactory;

	protected $fillable = [
		'team_id',
		'day',
		'school_timetable_id',
	];

	/**
	 * Toujours charger le créneau horaire : la resource en dérive l'heure `time`.
	 * Garde-fou contre les N+1 quel que soit le site d'appel.
	 *
	 * @var list<string>
	 */
	protected $with = ['schoolTimetable'];

	public function team(): BelongsTo
	{
		return $this->belongsTo(Team::class);
	}

	public function schoolTimetable(): BelongsTo
	{
		return $this->belongsTo(SchoolTimetable::class);
	}
}
