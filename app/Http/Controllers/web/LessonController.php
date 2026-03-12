<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\DeckResource;
use App\Http\Resources\GeneratorResource;
use App\Http\Resources\LessonResource;
use App\Http\Resources\PostShowResource;
use App\Http\Resources\UserTeamResource;
use Illuminate\Support\Facades\Auth;
use App\Models\Challenge;
use App\Models\Course;
use App\Models\Deck;
use App\Models\Generator;
use App\Models\Lesson;
use App\Models\Post;
use App\Models\Team;
use Illuminate\Http\Resources\Json\JsonResource;
use Inertia\Inertia;

class LessonController extends Controller
{
	public function index()
	{
	}

	public function show(Course $course, Lesson $lesson): \Inertia\Response
	{
		$user = Auth::user();
		$team = $user?->teams->intersect($course->teams)->first();

		return Inertia::render("Courses/LessonShow", [
			"course"     => CourseResource::make($course),
			"lesson"     => LessonResource::make($lesson),
			"lessonable" => $this->resolveLessonableResource($lesson),
			"team"       => $team ? UserTeamResource::make($team) : null,
		]);
	}

	public function adminShow(Course $course, Team $team, Lesson $lesson): \Inertia\Response
	{
		return Inertia::render("Courses/LessonShow", [
			"course"     => CourseResource::make($course),
			"lesson"     => LessonResource::make($lesson),
			"lessonable" => $this->resolveLessonableResource($lesson),
			"team"       => UserTeamResource::make($team),
		]);
	}

	protected function resolveLessonableResource(Lesson $lesson): ?JsonResource
	{
		$map = [
			Post::class      => PostShowResource::class,
			Challenge::class => ChallengeResource::class,
			Generator::class => GeneratorResource::class,
			Deck::class      => DeckResource::class,
			// TODO: vérifier que les resources quizz et deck fonctionnent.
			//			Quizz::class     => QuizzSessionResource::class,
		];

		$class = get_class($lesson->lessonable);

		if (!isset($map[$class])) {
			return null;
		}

		return new $map[$class]($lesson->lessonable);
	}

	public function create()
	{
	}

	public function edit($id)
	{
	}
}
