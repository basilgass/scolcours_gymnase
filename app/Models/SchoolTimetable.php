<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $period
 * @property string $start
 * @property string $end
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\SchoolTimetableFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolTimetable newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolTimetable newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolTimetable query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolTimetable whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolTimetable whereEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolTimetable whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolTimetable wherePeriod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolTimetable whereStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SchoolTimetable whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class SchoolTimetable extends Model
{
	use HasFactory;

	protected $table = 'school_timetable';

	protected $fillable = [
		'period',
		'start',
		'end',
	];

	protected function casts(): array
	{
		return [
			'start' => 'datetime:H:i',
			'end'   => 'datetime:H:i'
		];
	}
}
