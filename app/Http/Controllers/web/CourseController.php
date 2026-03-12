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


		$user->load(['teams', 'teams.courses']);
		$teamCourses = $user->courses;

		return Inertia::render("Courses/CourseIndex", [
			"teams"       => UserTeamResource::collection($user->teams),
			"teamCourses" => CourseResource::collection($teamCourses),
		]);
	}

	public function show(Course $course)
	{
		if (Auth::user()?->isAdmin) {
			return redirect()->route('admin.courses.index');

			// TODO: dois gérer un système pour savoir dans quel Team on se trouve.
			// get the query team.
			//			$teamSlug = $request->query('team');
			//			$team = Team::where('slug', $teamSlug)->first();

			//			return $team ?
			//				redirect()->route('admin.courses.dashboard', [
			//					'course' => $course->slug,
			//					'team'   => $team->slug
			//				]) :
			//				redirect()->route('admin.courses.index');
		}
		return $this->renderCourseWithTeam($course, "Courses/CourseShow");
	}

	private function renderCourseWithTeam(Course $course, $view, $matchingTeam = null)
	{
		if (!$matchingTeam) {
			$user = Auth::user();

			if (
				!$user ||
				(!$user->admin && !$user->courses->pluck('id')->contains($course->id))
			) {
				abort(403, 'Accès non autorisé.');
			}

			$matchingTeam = $course->teams->intersect($user->teams)->first();
		}

		$course->load([
			'lessons.lessonable',
			'lessons.calendars' => function ($query) use ($matchingTeam) {
				$query->where('team_id', $matchingTeam->id);
			}
		]);

		return Inertia::render($view, [
			"team"   => UserTeamResource::make($matchingTeam),
			"course" => CourseResource::make($course, $matchingTeam),
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

	public function dashboard(Course $course, Team $team)
	{

		return $this->renderCourseWithTeam($course, "Courses/CourseShowDashboard", $team);
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
