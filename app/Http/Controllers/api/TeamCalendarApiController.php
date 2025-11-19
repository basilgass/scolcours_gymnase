<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Calendars\SchoolCalendar;
use App\Models\Calendars\TeamCalendar;
use App\Models\Course;
use App\Models\SchoolTimetable;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamCalendarApiController extends Controller
{
	public function index(Team $team)
	{
		return $team->calendars;
	}

	public function show(Team $team, TeamCalendar $calendar)
	{
		return $calendar;
	}

	public function store(Request $request, Team $team)
	{
		$validated = $request->validate([
			"day"  => ['required', 'integer', 'between:1,5'],
			"time" => ['required', 'date_format:H:i:s']
		]);

		return $team->calendars()->create($validated);
	}

	public function update(Request $request, Team $team, TeamCalendar $calendar)
	{
		$validated = $request->validate([
			"day"  => ['required', 'integer', 'between:1,5'],
			"time" => ['required', 'date_format:H:i:s']
		]);

		$calendar->day = $validated["day"];
		$calendar->time = $validated["time"];
		$calendar->save();

		$calendar->refresh();

		return $calendar;
	}

	public function destroy(TeamCalendar $calendar)
	{
		$calendar->delete();

		return response()->noContent();
	}

	public function timetable()
	{
		return SchoolTimetable::all();
	}

	public function school_calendar()
	{
		return SchoolCalendar::all();
	}

	public function course_calendar(Team $team, Course $course)
	{
		return CourseResource::make($course, $team);
	}
}
