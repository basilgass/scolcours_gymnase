<?php

namespace App\Http\Controllers;

use App\Http\Requests\TargetClassRequest;
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
use App\Traits\ResolvesTarget;
use Illuminate\Http\Request;

class LessonApiController extends Controller
{
	use ResolvesTarget;

	public function index(Course $course)
	{
		return LessonResource::collection($course->lessons);
	}

	public function show(Lesson $lesson)
	{
		return LessonResource::make($lesson);
	}

	public function store(TargetClassRequest $request, Course $course)
	{
		// Get the lessonable item.
		$lessonable = $this->resolveTarget($request->validated());

		$lessonData = [
			'lessonable_type' => get_class($lessonable),
			'lessonable_id'   => $lessonable->id,
		];

		if ($request->has('scoreRules')) {
			$lessonData['scoreRules'] = $request->get('scoreRules');
		}

		$lesson = $course->lessons()->create($lessonData);


		return LessonResource::make($lesson);
	}

	public function storePosts(Request $request, Course $course)
	{
		$validated = $request->validate([
			"ids"=> ["required", "array"],
			"ids.*"=>["numeric"]
		]);

		$ids = $validated["ids"];
		$lessons = [];
		foreach ($ids as $id){
			$lessons[] = $course->lessons()->create([
				'lessonable_type'=> Post::class,
				'lessonable_id'=>$id,
			]);
		}

		return LessonResource::collection($lessons);
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
		$lesson->delete();
	}

}
