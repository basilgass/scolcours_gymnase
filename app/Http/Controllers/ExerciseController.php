<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class ExerciseController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth')->except(['index', 'show']);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return void
	 */
	public function index(Chapter $chapter)
	{
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @return \Illuminate\Database\Eloquent\Model
	 */
	public function store(Chapter $chapter, Request $request)
	{
		// Create an empty exercise.
		// get the new position - it's the last one +1
		$pos = $chapter->exercises()->max('position')??0;
		$exercise = $chapter->exercises()->create(
			[
				'active'=>true,
				'position' => $pos+1
			]
		);

		$exercise->blocks()->create();
		$exercise->blocks;
		$exercise->questions;
		return $exercise;
	}

	/**
	 * Display the specified resource.
	 *
	 * @param Exercise $exercise
	 * @return Exercise
	 */
	public function show(Exercise $exercise)
	{
		return $exercise;
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param Exercise $exercise
	 * @param \Illuminate\Http\Request $request
	 * @return void
	 */
	public function update(Exercise $exercise, Request $request)
	{
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\RedirectResponse
	 */
	public function destroy($id)
	{
		// Destroy the blocks.
		Exercise::destroy($id);

		return Redirect::back();
	}

	public function replicate(Exercise $exercise)
	{
		// Clone the exercise
		$clone = $exercise->replicate();
		$clone->push();

		// Clone the blocks with their illustrations
		// TODO: Send this in the block model
		foreach($exercise->blocks as $block){
			$clone->blocks()->save($block->duplicate());
		}

		// Clone the questions
		foreach($exercise->questions as $question){
			$clonedQuestion = $question->replicate();
			$clone->questions()->save($clonedQuestion);
		}

		return $clone;
	}
}
