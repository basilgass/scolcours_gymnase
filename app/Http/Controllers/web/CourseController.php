<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Http\Resources\UserTeamResource;
use App\Models\Course;
use App\Models\Team;
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
				"teamCourses" => [],
				"userCourses" => []
			]);
		}

		if ($user->admin and 1 === 0) {
			// Version si admin
			$teamCourses = Course::all();
		} else {
			$user->load(['teams', 'teams.courses']);
			$teamCourses = $user->courses;
		}

		return Inertia::render("Courses/CourseIndex", [
			"teams"       => UserTeamResource::collection($user->teams),
			"teamCourses" => CourseResource::collection($teamCourses),
		]);
	}

	public function show(Course $course)
	{
		$user = Auth::user();

		// On vérifie que l'utilisateur a le droit d'afficher le cours.
		if (
			!$user ||
			(!$user->admin && !$user->courses->pluck('id')->contains($course->id))
		) {
			// TODO: gérer les erreurs de navigation de manière plus classe
			abort(403, 'Accès non autorisé.');
		}

		$matchingTeam = $course->teams->intersect($user->teams)->first();

		// Charge les leçons et le modèle polymorphe lessonable
		$course->load([
			'lessons.lessonable',
			'lessons.calendars' => function ($query) use ($matchingTeam) {
				$query->where('team_id', $matchingTeam->id);
			}
		]);

		return Inertia::render("Courses/CourseShow", [
			"team"   => UserTeamResource::make($matchingTeam),
			"course" => CourseResource::make($course),
		]);
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

	public function showTeam(Course $course, Team $team)
	{
		$course->load([
			'lessons.lessonable',
			'lessons.calendars' => function ($query) use ($team) {
				$query->where('team_id', $team->id);
			}
		]);

		return Inertia::render("Courses/CourseShow", [
			"team"   => UserTeamResource::make($team),
			"course" => CourseResource::make($course),
		]);
	}

}
