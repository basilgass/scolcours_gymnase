<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
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

	public function show(Course $course)
	{
		$course->load([
			'lessons.lessonable' // Charge les leçons et le modèle polymorphe lessonable
		]);

		return Inertia::render("Courses/CourseShow", [
			"course" => CourseResource::make($course),
		]);
	}

	public function create()
	{
	}

	public function store(Request $request)
	{
	}

	public function edit(Course $course)
	{
		$course->load([
			'lessons.lessonable' // Charge les leçons et le modèle polymorphe lessonable
		]);

		return Inertia::render("Courses/CourseEdit", [
			"course" => CourseResource::make($course),
		]);
	}

	public function update(Request $request, $id)
	{
	}

	public function destroy($id)
	{
	}

	public function addLesson(Course $course)
	{

	}
}
