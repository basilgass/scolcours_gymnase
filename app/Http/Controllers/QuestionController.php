<?php

namespace App\Http\Controllers;

//use App\Models\Exercise;
use App\Http\Resources\QuestionResource;
use App\Models\Post;
use App\Models\Question;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class QuestionController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth')->except(['index', 'show']);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @return array
	 */
	public function store(Post $post, Request $request)
	{
		$validate = $request->validate(
			[
				'math'=>['boolean'],
				'body'=>['string', 'min:2'],
				'answer'=>['nullable'],
				'checker'=>['string', 'nullable'],
				'keyboard'=>['string', 'nullable']
			]
		);


		// If there is a return line, means it's multiple.
		$bodies = preg_split('/\r\n|\r|\n/', $validate['body']);
		$answers = preg_split('/\r\n|\r|\n/', $validate['answer']);
		$checkers = preg_split('/\r\n|\r|\n/', $validate['checker']);

		$questions = [];
		foreach($bodies as $key=>$body){
			$questions[] = $post->questions()->create([
				'body'=>$validate['math']?'\\['.$body.'\\]':$body,
				'answer'=>$answers[$key]??null,
				'checker'=>$checkers[$key]??$validate['checker'],
				'keyboard'=>$validate['keyboard']??''
			]);
		}

		return QuestionResource::collection(collect($questions));
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param Question $question
	 * @param \Illuminate\Http\Request $request
	 * @return Question
	 */
	public function update(Question $question, Request $request)
	{
		$validate = $request->validate(
			[
				'body'=>['string', 'min:2'],
				'answer'=>['nullable'],
				'checker'=>['string', 'nullable'],
				'keyboard'=>['string', 'nullable']
			]
		);

		$validate['keyboard'] = $validate['keyboard']??'';

		$question->update($validate);

		return QuestionResource::make($question);
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\RedirectResponse
	 */
	public function destroy($id)
	{
		Question::destroy($id);

		return Redirect::back();
	}


	public function storeAnswer(Question $question, Request $request)
	{
		$validate = $request->validate([
			'answer'=>['required', 'min:1'],
			'result'=>['boolean']
		]);

		// User must be logged in.
		$user = Auth::user();
		if(!$user){return $validate;}

		// The question must not already by answered.
		if($question->users()
			->wherePivot('result', true)
			->where('user_id', $user->id)->count()>0){
			return true;
		}

		// Save the new question
		$question->users()->attach($user, $validate);

		return $validate;
	}

	public function resetAnswers(Post $post)
	{
		$user = Auth::user();
		if(!$user){return false;}

		$questions = $user->questions()->detach($post->questions->pluck('id'));
		return true;
	}
}
