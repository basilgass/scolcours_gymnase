<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourseStoreRequest;
use App\Http\Requests\updateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\Score;
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
		$course->update($request->validated());
		$course->blocks[0]->body = $request->has('body') ? $request->input('body') : null;
		$course->blocks[0]->save();

		$course->refresh();
		return CourseResource::make($course);
	}

	public function destroy(Course $course)
	{
	}

	public function toggleTeam(Course $course, Team $team)
	{

		$attached = $course->teams()->where('teams.id', $team->id)->exists();

		if ($attached) {
			$status = false;
			$course->teams()->detach($team->id);
		} else {
			$status = true;
			$course->teams()->attach($team->id);
		}
		return $status;
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

	public function teamStats(Course $course, Team $team)
	{
		// Récupère tous les utilisateurs de l'équipe
		$users = $team->users;

		// Récupère les ids des lessons.
		$ids = $course->lessons->pluck('id');

		// Récupère tous les scores des utilisateurs pour les leçons concernées.
		$scores = Score::whereIn('user_id', $users->pluck('id'))
		               ->where('scoreable_type', 'App\Models\Lesson')
		               ->whereIn('scoreable_id', $ids)
		               ->get();

		$stats = [];
		foreach ($ids as $lessonId) {
			$lessonScores = $scores->where('scoreable_id', $lessonId);
			$resolvedScores = $lessonScores->where('is_resolved', true);
			$stats[$lessonId] = [
				'users_id'        => $resolvedScores->pluck('user_id'),
				'lesson_id'       => $lessonId,
				'total_scores'    => $lessonScores->count(),
				'resolved_scores' => $resolvedScores->count(),
			];
		}

		return $stats;
	}
}
