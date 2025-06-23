<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseStoreRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;

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

	public function update(Request $request, Course $course)
	{
	}

	public function destroy(Course $course)
	{
	}

	public function fetchLessonables(Course $course)
	{
		$arr = [];

		// Get the posts
		$arr = array_merge(
		);
		// Get the challenges
		// Get the decks
		// Get... ???
	}
}
