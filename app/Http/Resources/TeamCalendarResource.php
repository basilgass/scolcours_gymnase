<?php

namespace App\Http\Resources;

use App\Models\Calendars\TeamCalendar;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/** @mixin TeamCalendar */
class TeamCalendarResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return [
			'id'   => $this->id,
			'day'  => $this->day,
			'time' => Carbon::createFromFormat('H:i:s', $this->time)->format('H:i'),
		];
	}
}
