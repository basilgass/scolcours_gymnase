<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Http\Resources\LessonResource;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Theme;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{
	public function index()
	{
	}

	public function create()
	{
	}

	public function store(Request $request)
	{
	}

	public function show(Course $course, Lesson $lesson)
	{
		return Inertia::render("Courses/LessonShow", [
			"theme"  => Theme::find($course->theme_id),
			"course" => CourseResource::make($course),
			"lesson" => LessonResource::make($lesson),
		]);
	}

	public function edit($id)
	{
	}

	public function update(Request $request, $id)
	{
	}

	public function destroy($id)
	{
	}
}
