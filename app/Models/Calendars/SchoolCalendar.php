<?php

namespace App\Models\Calendars;

use Illuminate\Database\Eloquent\Model;

class SchoolCalendar extends Model
{
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
