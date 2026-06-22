<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolTimetable extends Model
{
	use HasFactory;

	protected $table = 'school_timetable';

	protected $fillable = [
		'period',
		'start',
		'end',
	];
}
