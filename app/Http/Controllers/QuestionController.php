<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuestionResource;
use App\Models\Post;
use App\Models\Question;
use App\Models\Quizz;
use Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class QuestionController extends Controller
{
	public function getQuestionable(String $type, int $id): Post|Quizz
	{
		$target = null;
		if (ucfirst($type)==='Post') {
			return Post::findOrFail($id);
		}

		if(ucfirst($type)==='Quizz') {
			return Quizz::findOrFail($id);
		}

		abort(404);
	}
	public function __construct()
	{
		$this->middleware('auth')->except(['index', 'show']);
	}

	public function index(Post $post)
	{
		return QuestionResource::collection($post->questions);
	}

	public function store(String $type, int $id, Request $request)
	{
		$target = $this->getQuestionable($type, $id);

		$validate = $request->validate(
			[
				'body' => ['string', 'min:2'],
				'answer' => ['nullable'],
				'checker' => ['string', 'nullable'],
				'keyboard' => ['string', 'nullable'],
				'parameters' => ['string', 'nullable'],
			]
		);

		// Create the question new way.
		$question = $target->questions()->create([
			'answer' => $validate['answer'] ?? null,
			'checker' => $validate['checker'] ?? null,
			'keyboard' => $validate['keyboard'] ?? '',
			'parameters' => $validate['parameters'] ?? '',
			'order' => count($target->questions)+1
		]);

		$question->blocks()->create([
			'body' => $validate['body']??''
		]);

		return QuestionResource::make($question);
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return AnonymousResourceCollection
	 */
//	public function storeMultiple(Post $post, Request $request)
//	{
//		$validate = $request->validate(
//			[
//				'math' => ['boolean'],
//				'mathAppend' => ['string', 'nullable'],
//				'body' => ['string', 'min:2'],
//				'answer' => ['nullable'],
//				'checker' => ['string', 'nullable'],
//				'keyboard' => ['string', 'nullable'],
//				'parameters' => ['string', 'nullable'],
//			]
//		);
//
//
//		// If there is a return line, means it's multiple.
//		$answers = preg_split('/\r\n|\r|\n/', $validate['answer']);
//		$checkers = preg_split('/\r\n|\r|\n/', $validate['checker']);
//		$bodies = count($answers) > 1 ? preg_split('/\r\n|\r|\n/', $validate['body']) : [];
//
//		$questions = [];
//		foreach ($answers as $key => $answer) {
//			$body = $bodies[$key] ?? $validate['body'];
//			$checker = $checkers[$key] ?? $validate['checker'];
//
//			if ($validate['math']) {
//				$body = '\\[' . $body . (Str::endsWith($body, '=') ? '$a' : '') . '\\]';
//			}
//
//			if ($validate['mathAppend']) {
//				if (Str::endsWith($body, '\\]')) {
//					$body = $body . PHP_EOL . $validate['mathAppend'];
//				} else {
//					$body = $body . PHP_EOL . PHP_EOL . $validate['mathAppend'];
//				}
//			}
//
//			// Create the question new way.
//			$theQuestion = $post->questions()->create([
//				'answer' => $answer ?? null,
//				'checker' => $checker,
//				'keyboard' => $validate['keyboard'] ?? '',
//				'parameters' => $validate['parameters'] ?? '',
//			]);
//
//			$theQuestion->blocks()->create([
//				"title" => '',
//				'body' => $body
//			]);
//
//			$questions[] = $theQuestion;
//		}
//
//		return QuestionResource::collection(collect($questions));
//	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param Question $question
	 * @param Request $request
	 * @return Question
	 */
	public function update(Question $question, Request $request)
	{
		$validate = $request->validate(
			[
				'answer' => ['nullable'],
				'checker' => ['string', 'nullable'],
				'keyboard' => ['string', 'nullable'],
				'parameters' => ['string', 'nullable'],
				'css' => ['string', 'nullable'],
			]
		);

		$validate['keyboard'] = $validate['keyboard'] ?? '';

		$question->update($validate);

		return QuestionResource::make($question);
	}

	public function updateQuestionsOrder(Request $request)
	{
		foreach ($request['order'] as $value) {
			Question::find($value['id'])?->update(['order' => $value['order']]);
		}
		return true;
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return RedirectResponse
	 */
	public function destroy($id)
	{
		$question = Question::findOrFail($id);
		$target = $question->questionable;

		// Destroy the question.
		$question->delete();

		// Refresh the target
		$target->refresh();

		// Reorder the questions
		foreach($target->questions as $idx=>$question){
			$question->update(['order'=>$idx+1]);
		}
		return Redirect::back();
	}


	public function storeAnswer(Question $question, Request $request)
	{
		$validate = $request->validate([
			'answer' => ['required', 'min:1'],
			'result' => ['boolean']
		]);

		// User must be logged in.
		$user = Auth::user();
		if (!$user) {
			return $validate;
		}

		// The question must not already be answered.
		if ($question->users()
				->wherePivot('result', true)
				->where('user_id', $user->id)->count() > 0) {
			return true;
		}

		// remove all "wrong" answers.
		$attempts = 0;
		if($validate['result']) {
			$attempts = $question->clean();
		}

//		$attempts = 0;
		// Save the new question
		$question->users()->attach($user,
			[
				...$validate,
				"attempts"=>$attempts+1
			]
		);

		return $validate;
	}

	public function resetAnswers(String $type, int $id)
	{
		$user = Auth::user();
		if (!$user) {
			return false;
		}

		$target = $this->getQuestionable($type, $id);
		$user->questions()->detach($target->questions->pluck('id'));
		return true;
	}

	public function duplicate(Question $question)
	{
		$newQuestion = $question->replicate();
		$newQuestion->push();
		$newQuestion->blocks()->save($question->blocks[0]->duplicate());

		// update the new order (place it at last).
		if($newQuestion->post) {
			$newQuestion->order = count($newQuestion->post->questions);
		}else if($newQuestion->quizz) {
			$newQuestion->order = count($newQuestion->quizz->questions);
		}
		$newQuestion->save();
		$newQuestion->refresh();

		return QuestionResource::make($newQuestion);
	}


	public function edit(Question $question)
	{
		return Inertia::render("Devs/Edit/QuestionEditPage", [
			'question' => QuestionResource::make($question)
		]);
	}
}
