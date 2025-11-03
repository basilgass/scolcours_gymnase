<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolTimetable extends Model
{
	protected $table = 'school_timetable';

	protected $fillable = [
		'period',
		'start',
		'end',
	];
}
