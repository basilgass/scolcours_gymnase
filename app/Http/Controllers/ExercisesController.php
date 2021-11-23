<?php

	namespace App\Http\Controllers;

	use App\Models\Exercise;
	use Illuminate\Http\Request;
	use Illuminate\Support\Facades\Auth;
	use Illuminate\Support\Facades\Redirect;
	use Inertia\Inertia;

	class ExercisesController extends Controller
	{
		public function index()
		{
			//
		}

		public function create()
		{
			return Inertia::render('Exercises/create');
		}

		public function store(Request $request)
		{
			$attributes = $request->validate(
				[
					"chapter_id" => ['required', 'exists:App\Models\Chapter,id'],
					'title' => [],
					'body' => ['required', "min:2"],
					"answer" => [],
					"explanation" => [],
					'illustrations.*' => ['image'],
					"generators" => []
				]
			);

			$isNotExercise = ["illustrations", "generators"];

			if (str_contains($attributes['body'], '@@')) {
				// Create a new exercise

				$generators = $attributes['generators'];

				foreach (explode("\n", $generators) as $generator){
					$generator = explode(',', $generator);
					$question = str_replace("@@", $generator[0], $attributes['body']);
					$answer = count($generator)>1?$generator[1]:"";

					$exercise = Exercise::create(
						collect([
							        "chapter_id" => $attributes['chapter_id'],
							        'title' => $attributes['title']??"",
							        'body' => $question,
							        "answer" => $answer,
							        "explanation" => null,
						        ])
							->filter(fn($value, $key) => !in_array($key, $isNotExercise))
							->toArray()
					);

				}


			} else {
				// Create a new exercise
				$exercise = Exercise::create(
					collect($attributes)
						->filter(fn($value, $key) => !in_array($key, $isNotExercise))
						->toArray()
				);

				// add the illustrations
				if ($request->illustrations) {
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
			$chapter = $exercise->chapter;

			// Destroy the model
			if(Auth::User()?->admin) {
				$exercise->delete();
			}

			return Redirect::route('theme.chapter', [$chapter->theme, $chapter]);
		}
	}
