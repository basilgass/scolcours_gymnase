<?php

namespace App\Http\Resources;

use App\Models\Calendars\TeamCalendar;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin TeamCalendar */
class TeamCalendarResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id'                  => $this->id,
			'day'                 => $this->day,
			'school_timetable_id' => $this->school_timetable_id,
			// Heure dérivée du créneau lié (school_timetable.start est casté H:i).
			'time'                => $this->schoolTimetable->start->format('H:i'),
		];
	}
}
