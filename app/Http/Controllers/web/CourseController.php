<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Challenge;
use App\Models\Course;
use App\Models\Deck;
use App\Models\Generator;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
	public function index()
	{
		$user = Auth::user();

		// L'utilisateur n'est pas connecté
		if (!$user) {
			return Inertia::render("Courses/CourseIndex", [
				"courses" => []
			]);
		}

		$courses = $user->admin ? Course::all() : $user->courses;

		// Version si admin
		return Inertia::render("Courses/CourseIndex", [
			"courses" => $courses ? CourseResource::collection($courses) : []
		]);
	}

	public function show(Course $course)
	{
		$user = Auth::user();

		// On vérifie que l'utilisateur a le droit d'afficher le cours.
		if (!$user || (!$user->admin && !$user->courses->contains($course->id))) {
			// TODO: gérer les erreurs de navigation de manière plus classe
			abort(403, 'Accès non autorisé.');
		}

		// Charge les leçons et le modèle polymorphe lessonable
		$course->load(['lessons.lessonable']);

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
