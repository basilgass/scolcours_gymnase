<?php

namespace App\Models\Calendars;

use App\Models\Team;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamCalendar extends Model
{
	protected $fillable = [
		'team_id',
		'day',
		'time',
	];

	public function team(): BelongsTo
	{
		return $this->belongsTo(Team::class);
	}
}
