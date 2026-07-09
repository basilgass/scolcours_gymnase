<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\TargetClassRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Evaluation;
use App\Models\Post;
use App\Models\Question;
use App\Models\Quizz;
use App\Traits\CanMoveToTarget;
use App\Traits\ResolvesTarget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionApiController extends Controller
{
	use ResolvesTarget;
	use CanMoveToTarget;

	public function index()
	{
		return response()->noContent();
	}

	public function show(Question $question)
	{
		return QuestionResource::make($question);

	}

	public function store(StoreQuestionRequest $request): QuestionResource
	{
		$validated = $request->validated();
		$questionable = $this->resolveTarget($validated, 'questions');

		// Add the new order.
		$nb_questions = $questionable->questions->count();
		$validated['order'] = $nb_questions + 1;

		// Create the question new way.
		$question = $questionable->questions()->create($validated);

		// Create the question's block
		// TODO : assurer que le block est créé automatiquement à la création de la question => booted ?
		$question->blocks()->create([
			"body" => "sans contenu"
		]);

		return QuestionResource::make($question);
	}

	public function destroy(Question $question)
	{
		$target = $question->questionable;

		// Destroy the question.
		$question->delete();

		// Refresh the target
		$target->refresh();

		// Reorder the questions
		foreach ($target->questions as $idx => $question) {
			$question->update(['order' => $idx + 1]);
		}

		if ($target instanceof Post) {
			return route('posts.show', $target->id);
		}

		return $target;
	}

	public function update(Question $question, UpdateQuestionRequest $request): bool
	{
		$question->update($request->validated());

		return true;
	}

	public function updateQuestionsOrder(string $type, int $id, Request $request)
	{
		$target = $this->getQuestionable($type, $id);

		foreach ($request['order'] as $value) {
			$target
				->questions()
				->where('id', $value['id'])
				->first()?->update(['order' => $value['order']]);
		}

		return QuestionResource::collection($target->questions()->orderBy('order')->get());
	}

	public function getQuestionable(string $type, int $id): Post|Quizz|Evaluation
	{
		$target = null;
		if (ucfirst($type) === 'Post') {
			return Post::findOrFail($id);
		}

		if (ucfirst($type) === 'Quizz') {
			return Quizz::findOrFail($id);
		}

		if (ucfirst($type) === 'Evaluation') {
			return Evaluation::findOrFail($id);
		}

		abort(404);
	}

	public function duplicate(Question $question)
	{
		// Duplicate a question
		$newQuestion = $question->replicate();
		$newQuestion->push();

		// Duplicate the block
		$newQuestion->blocks()->save($question->blocks[0]->duplicate());

		// update the new order (place it at last).
		$target = $newQuestion->questionable;
		if ($target->exists) {
			$newQuestion->order = count($target->questions);
		}
		$newQuestion->save();
		$newQuestion->refresh();

		return QuestionResource::make($newQuestion);
	}

	public function updateQuestionDisplayIf(Question $question, Request $request): bool
	{
		$validated = $request->validate([
			'displayIf' => ['string', 'nullable']
		]);

		$question->display_if = $validated['displayIf'];
		$question->save();

		return true;
	}

	public function updateBatchDisplayIf(Request $request)
	{
		$validated = $request->validate([
			"updates"              => ["required", "array"],
			'updates.*.id'         => ['required', 'integer', 'exists:questions,id'],
			'updates.*.display_if' => ['nullable', 'integer']
		]);

		DB::transaction(function () use ($validated) {
			foreach ($validated['updates'] as $data) {
				Question::where('id', $data['id'])->update([
					'display_if' => $data['display_if']
				]);
			}
		});

	}

	// Move the question to another Post.
	public function move(Question $question, TargetClassRequest $request): array
	{
		$target = $this->resolveTarget($request->validated());
		return $this->moveToTarget(
			$question, 'questions', $target, 'questionable'
		);

		//		$maxOrder = $questionable->questions()->max('order') ?? 0;
		//
		//		$question->questionable()->associate($questionable);
		//		$question->order = $maxOrder+1;
		//		$question->save();
		//
		//		return [
		//			'url'   => $questionable->url,
		//			'label' => $questionable->title,
		//		];
	}

	/**
	 * public function move(Block $block, TargetClassRequest $request)
	 * {
	 * $blockable = $this->resolveTarget($request->validated());
	 *
	 * $block->update([
	 * 'blockable_id'   => $blockable->id,
	 * 'blockable_type' => get_class($blockable),
	 * 'order'          => count($blockable->blocks) + 2
	 * ]);
	 *
	 * $block->refresh();
	 *
	 * return [
	 * 'url'   => $blockable->url,
	 * 'label' => $blockable->title,
	 * ];
	 * }
	 */
}
