<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuestionResource;
use App\Models\Post;
use App\Models\Question;
use Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuestionController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth')->except(['index', 'show']);
	}

	public function index(Post $post)
	{
		return QuestionResource::collection($post->questions);
	}

	public function store(Post $post, Request $request)
	{
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
		$question = $post->questions()->create([
			'answer' => $validate['answer'] ?? null,
			'checker' => $validate['checker'] ?? null,
			'keyboard' => $validate['keyboard'] ?? '',
			'parameters' => $validate['parameters'] ?? '',
			'order' => count($post->questions)+1
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
	public function storeMultiple(Post $post, Request $request)
	{
		$validate = $request->validate(
			[
				'math' => ['boolean'],
				'mathAppend' => ['string', 'nullable'],
				'body' => ['string', 'min:2'],
				'answer' => ['nullable'],
				'checker' => ['string', 'nullable'],
				'keyboard' => ['string', 'nullable'],
				'parameters' => ['string', 'nullable'],
			]
		);


		// If there is a return line, means it's multiple.
		$answers = preg_split('/\r\n|\r|\n/', $validate['answer']);
		$checkers = preg_split('/\r\n|\r|\n/', $validate['checker']);
		$bodies = count($answers) > 1 ? preg_split('/\r\n|\r|\n/', $validate['body']) : [];

		$questions = [];
		foreach ($answers as $key => $answer) {
			$body = $bodies[$key] ?? $validate['body'];
			$checker = $checkers[$key] ?? $validate['checker'];

			if ($validate['math']) {
				$body = '\\[' . $body . (Str::endsWith($body, '=') ? '$a' : '') . '\\]';
			}

			if ($validate['mathAppend']) {
				if (Str::endsWith($body, '\\]')) {
					$body = $body . PHP_EOL . $validate['mathAppend'];
				} else {
					$body = $body . PHP_EOL . PHP_EOL . $validate['mathAppend'];
				}
			}

			// Create the question new way.
			$theQuestion = $post->questions()->create([
				'answer' => $answer ?? null,
				'checker' => $checker,
				'keyboard' => $validate['keyboard'] ?? '',
				'parameters' => $validate['parameters'] ?? '',
			]);

			$theQuestion->blocks()->create([
				"title" => '',
				'body' => $body
			]);

			$questions[] = $theQuestion;
		}

		return QuestionResource::collection(collect($questions));
	}

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
			]
		);

		$validate['keyboard'] = $validate['keyboard'] ?? '';

		$question->update($validate);

		return QuestionResource::make($question);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return RedirectResponse
	 */
	public function destroy($id)
	{
		$postId = Question::find($id)->post->id;
		Question::destroy($id);

		// Reorder the questions
		foreach(Post::find($postId)->questions as $idx=>$question){
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

	public function resetAnswers(Post $post)
	{
		$user = Auth::user();
		if (!$user) {
			return false;
		}

		$user->questions()->detach($post->questions->pluck('id'));
		return true;
	}

	public function duplicate(Question $question)
	{
		$newQuestion = $question->replicate();
		$newQuestion->push();
		$newQuestion->blocks()->save($question->blocks[0]->duplicate());

		return QuestionResource::make($newQuestion);
	}


	public function edit(Question $question)
	{
		return Inertia::render("Devs/Edit/QuestionEditPage", [
			'question' => QuestionResource::make($question)
		]);
	}
}
