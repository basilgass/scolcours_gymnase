<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuestionResource;
use App\Http\Resources\ThemeResource;
use App\Models\Post;
use App\Models\Question;
use App\Models\Quizz;
use Auth;
use Illuminate\Http\Request;
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
				'answer' => ['min:1'],
				'checker' => ['string', 'nullable'],
				'keyboard' => ['string', 'nullable'],
			]
		);

		// Create the question new way.
		$question = $target->questions()->create([
			'answer' => $validate['answer'] ?? null,
			'checker' => $validate['checker'] ?? null,
			'keyboard' => $validate['keyboard'] ?? '',
			'order' => count($target->questions)+1
		]);

		$question->blocks()->create([
			'body' => $validate['body']??''
		]);

		return QuestionResource::make($question);
	}

	public function show(Question $question)
	{
		// Go to the question.
		return \redirect(route('themes.chapters.slide.anchor', [
			'theme' => $question->questionable->chapter->theme->slug,
			'chapter' => $question->questionable->chapter->slug,
			'order' => $question->questionable->order,
			'type' => 'question',
			'id' => $question->id
		]));

	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param Question $question
	 * @param Request $request
	 * @return QuestionResource
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

	public function updateQuestionsOrder(String $type, int $id, Request $request)
	{
		$target = $this->getQuestionable($type, $id);

		foreach ($request['order'] as $value) {
			$target->questions()->where('id', $value['id'])->first()?->update(['order' => $value['order']]);
		}

		return QuestionResource::collection($target->questions()->orderBy('order')->get());
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return string
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

		if($target instanceof Post){
			return route('posts.show', $target->id);
		}

		return $target;
	}


	public function storeAnswer(Question $question, Request $request)
	{
		// On valide les données
		$validate = $request->validate([
			'result' => ['boolean'],
			'answer'=> ['string', 'min:1']
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

		// On récupère la liste des réponses.
		$userQuestion = $question->users()
			->where('user_id', $user->id)->first();

		// Default value.
		$answers = $userQuestion?
			$userQuestion->pivot->answer.PHP_EOL.$validate['answer']:
			$validate['answer'];
		$attempts = count(explode(PHP_EOL, $answers));

		// On ajoute ou modifie la valeur.
		$question->users()->syncWithPivotValues(
			$user,
			[
				"answer" => $answers,
				"result" => $validate["result"],
				"attempts"=>$attempts,
				],
			false
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
		// Duplicate a question
		$newQuestion = $question->replicate();
		$newQuestion->push();

		// Duplicate the block
		$newQuestion->blocks()->save($question->blocks[0]->duplicate());

		// update the new order (place it at last).
		$target = $newQuestion->questionable;
		if($target->exists){
			$newQuestion->order = count($target->questions);
		}
		$newQuestion->save();
		$newQuestion->refresh();

		return QuestionResource::make($newQuestion);
	}


	public function edit(Question $question): \Inertia\Response
	{
		return Inertia::render("Questions/QuestionEdit", [
			'theme' => ThemeResource::make($question->questionable->chapter->theme),
			'question' => QuestionResource::make($question)
		]);
	}


	public function updateQuestionDisplayIf(Question $question, Request $request): bool
	{
		$validation = $request->validate([
			'displayIf' => ['string', 'nullable']
		]);

		$question->displayIf = $validation['displayIf'];
		$question->save();

		return true;
	}
	public function updateQuestionsDisplayIf(Request $request): bool
	{
		$validation = $request->validate([
			'values' => ['array'],
			'values.*.id' => ['exists:App\Models\Question,id'],
			'values.*.displayIf' => ['string', 'nullable']
		]);

		foreach ($validation["values"] as $value) {
			$question = Question::find($value['id']);
			$question->displayIf = $value['displayIf'];
			$question->save();
		}

		return true;
	}

	// Move the question to another Post.
	public function moveToPost(Question $question, Post $post): array
	{

		$question->questionable()->associate($post);
		$question->order = count($post->questions)+2;
		$question->save();

		return [
			'url'=>$post->url,
			'label'=>$post->title,
		];
	}
}
