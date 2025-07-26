<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\DeckResource;
use App\Http\Resources\GeneratorResource;
use App\Http\Resources\LessonResource;
use App\Http\Resources\PostShowResource;
use App\Http\Resources\ScoreResource;
use App\Models\Challenge;
use App\Models\Course;
use App\Models\Deck;
use App\Models\Generator;
use App\Models\Lesson;
use App\Models\Post;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Inertia\Inertia;

class LessonController extends Controller
{
	public function index()
	{
	}

	public function show(Course $course, int $lessonPos)
	{
		$lesson = $course->lessons[$lessonPos-1];

		return Inertia::render("Courses/LessonShow", [
			"course" => CourseResource::make($course),
			"lesson" => LessonResource::make($lesson),
			"lessonable" => $this->resolveLessonableResource($lesson)
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

	protected function resolveLessonableResource(Lesson $lesson): ?JsonResource
	{
		$map = [
			Post::class      => PostShowResource::class,
			Challenge::class => ChallengeResource::class,
			Generator::class => GeneratorResource::class,
			Deck::class      => DeckResource::class,
			// TODO: vérifier que les resources quizz et deck fonctionnent.
			//			Quizz::class     => QuizzSessionRessource::class,
		];

		$class = get_class($lesson->lessonable);

		if (!isset($map[$class])) {
			return null;
		}

		return new $map[$class]($lesson->lessonable);
	}
}
