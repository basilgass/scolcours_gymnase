<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChallengeResource;
use App\Http\Resources\DeckResource;
use App\Http\Resources\GeneratorResource;
use App\Http\Resources\LessonResource;
use App\Http\Resources\PostShowResource;
use App\Models\Challenge;
use App\Models\Course;
use App\Models\Deck;
use App\Models\Generator;
use App\Models\Lesson;
use App\Models\Post;
use Illuminate\Http\Request;

class LessonApiController extends Controller
{
	public function index(Course $course)
	{
		return LessonResource::collection($course->lessons);
	}

	public function show(Lesson $lesson)
	{
		return LessonResource::make($lesson);
	}

	public function store(Request $request, Course $course)
	{
	}

	public function update(Request $request, Lesson $lesson)
	{
		$validated = $request->validate([
			'requires' => ['string', 'nullable'],
			'parameters'=>['array', 'nullable']
		]);

		$lesson->update($validated);
		$lesson->refresh();

		return LessonResource::make($lesson);
	}

	public function destroy(Lesson $lesson)
	{
	}

}
