<?php

namespace App\Http\Controllers;

use App\Http\Resources\LessonResource;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonApiController extends Controller
{
	public function index(Course $course)
	{
		return LessonResource::collection($course->lessons);
	}

	public function show(Lesson $lesson)
	{
		return LessonResource::make($lesson);
	}

	public function store(Request $request, Course $course)
	{
	}

	public function update(Request $request, Lesson $lesson)
	{
	}

	public function destroy(Lesson $lesson)
	{
	}
}
