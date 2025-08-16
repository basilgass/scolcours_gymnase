<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseStoreRequest;
use App\Http\Requests\updateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\Team;

class CourseApiController extends Controller
{
	public function index()
	{

	}

	public function show(Course $course)
	{
	}

	public function store(CourseStoreRequest $request)
	{

		$course = Course::create($request->validated());

		$course->blocks()->create();

		return CourseResource::make($course);
	}

	public function update(updateCourseRequest $request, Course $course)
	{
		dump($request->validated());
		return
			$course->update($request->validated());
		//		$course->refresh();

		return CourseResource::make($course);
	}

	public function destroy(Course $course)
	{
	}

	public function toggleTeam(Course $course, Team $team)
	{

		$attached = $course->teams()->where('teams.id', $team->id)->exists();

		if ($attached) {
			$course->teams()->detach($team->id);
		} else {
			$course->teams()->attach($team->id);
		}
		return response()->noContent();
	}

	public function fetchLessonables(Course $course)
	{
		$arr = [];

		// Get the posts
		$arr = array_merge();
		// Get the challenges
		// Get the decks
		// Get... ???
	}
}
