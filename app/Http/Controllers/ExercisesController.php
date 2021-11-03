<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExercisesController extends Controller
{
	public function index()
	{
		//
	}

	public function create()
	{
		return Inertia::render('addExercise');
	}

	public function store(Request $request)
	{
		$attributes = $request->validate(
			[
				"chapter_id" => ['required', 'exists:App\Models\Chapter,id'],
				'body' => ['required', "min:5"],
				"answer" => ['required'],
				"explanation" => [],
				'illustrations.*' => ['image']
			]
		);

		// Create a new exercise
		$exercise = Exercise::create(
			collect($attributes)->filter(fn($value, $key) => $key !== "illustrations")->toArray()
		);

		// add the illustrations
		if($request->illustrations) {
			foreach ($attributes['illustrations'] as $i => $illustration) {
				// Numbering
				$nb = str_pad($i, 2, '0', STR_PAD_LEFT);

				// Save the file
				$filepath = $illustration->storeAs('illustrations', "exercice_{$exercise->id}_{$nb}.{$illustration->extension()}", 'public');

				// Add to the database.
				$exercise->illustrations()->create(
					["url" => $filepath]
				);
			}
		}

		// Go back to the form
		return redirect()->route('exercise.create');
	}

	public function show(Exercise $exercise)
	{
		//
	}

	public function edit(Exercise $exercise)
	{
		//
	}

	public function update(Request $request, Exercise $exercise)
	{
		//
	}

	public function destroy(Exercise $exercise)
	{
		//
	}
}
