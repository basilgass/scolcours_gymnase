<?php

namespace App\Models\Calendars;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
