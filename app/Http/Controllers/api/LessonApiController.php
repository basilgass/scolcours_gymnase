<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TargetClassRequest;
use App\Http\Resources\LessonResource;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Post;
use App\Models\Score;
use App\Models\Team;
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

		$lessonData['order'] = $course->lessons->count()+1;

		$lesson = $course->lessons()->create($lessonData);


		return LessonResource::make($lesson);
	}

	public function destroy(Lesson $lesson)
	{
		$lesson->delete();
	}

	public function storePosts(Request $request, Course $course)
	{
		$validated = $request->validate([
			"ids"   => ["required", "array"],
			"ids.*" => ["numeric"]
		]);

		$ids = $validated["ids"];
		$lessons = [];
		foreach ($ids as $id) {
			$lessons[] = $course->lessons()->create([
				'lessonable_type' => Post::class,
				'lessonable_id'   => $id,
			]);
		}

		return LessonResource::collection($lessons);
	}

	public function updateLessonsOrder(Course $course, Request $request)
	{
		$request->validate([
			"order"         => ['array', "required"],
			"order.*.id"    => ["int", "required"],
			"order.*.order" => ["int", "required"]
		]);


		foreach ($request['order'] as $value) {
			$course
				->lessons()
				->where('id', $value['id'])
				->first()
				?->update(['order' => $value['order']]);
		}

		$course->refresh();
		return LessonResource::collection($course->lessons);
	}

	public function update(Request $request, Lesson $lesson)
	{
		$validated = $request->validate([
			'requires'   => ['string', 'nullable'],
			'scoreRules' => ['array', 'nullable'],
		]);

		$lesson->update($validated);
		$lesson->refresh();

		return LessonResource::make($lesson);
	}

	public function updateLessonCalendar(Request $request, Team $team, Lesson $lesson)
	{

		$validated = $request->validate([
			'scheduled_at' => ['required', 'date_format:Y-m-d\TH:i']
		]);

		$calendar = $lesson
			->calendars()
			->updateOrCreate(
				[
					'lesson_id' => $lesson->id,
					'team_id'   => $team->id,
				],
				$validated
			);

		return $calendar;
	}

}
