<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Http\Resources\TeamCalendarResource;
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
		return TeamCalendarResource::collection($team->calendars);
	}

	public function show(Team $team, TeamCalendar $calendar)
	{
		return TeamCalendarResource::make($calendar);
	}

	public function store(Request $request, Team $team)
	{
		$validated = $request->validate([
			"day"                 => ['required', 'integer', 'between:1,5'],
			"school_timetable_id" => ['required', 'integer', 'exists:school_timetable,id']
		]);

		$cal = $team->calendars()->create($validated);
		$cal->load('schoolTimetable');

		return TeamCalendarResource::make($cal);
	}

	public function update(Request $request, Team $team, TeamCalendar $calendar)
	{
		$validated = $request->validate([
			"day"                 => ['required', 'integer', 'between:1,5'],
			"school_timetable_id" => ['required', 'integer', 'exists:school_timetable,id']
		]);

		$calendar->day = $validated["day"];
		$calendar->school_timetable_id = $validated["school_timetable_id"];
		$calendar->save();

		$calendar->load('schoolTimetable');

		return TeamCalendarResource::make($calendar);
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
