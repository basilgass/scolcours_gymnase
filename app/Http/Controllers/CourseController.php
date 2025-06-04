<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
	public function index()
	{
		return Inertia::render("Courses/CourseIndex", [
			"courses" => CourseResource::collection(Course::all())
		]);
	}

	public function create()
	{
	}

	public function store(Request $request)
	{
	}

	public function show(Course $course)
	{
		$course->load([
						  'lessons.lessonable' // Charge les leçons et le modèle polymorphe lessonable
					  ]);

		return Inertia::render("Courses/CourseShow", [
			"course" => CourseResource::make($course),
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
