<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Http\Resources\LessonResource;
use App\Http\Resources\ScoreResource;
use App\Models\Course;
use App\Models\Lesson;
use Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{
	public function index()
	{
	}

	public function show(Course $course, Lesson $lesson)
	{
		$user = Auth::user();

		// Get the score for the user
		$score = $lesson->lessonable->userScores();

		return Inertia::render("Courses/LessonShow", [
			"course" => CourseResource::make($course),
			"lesson" => LessonResource::make($lesson),
			"score"  => ScoreResource::make($score)
		]);
	}

	public function create()
	{
	}

	public function store(Request $request)
	{
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
