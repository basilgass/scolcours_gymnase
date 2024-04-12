<?php

namespace App\Http\Controllers;

use App\Http\Resources\FormulaResource;
use App\Models\Chapter;
use App\Models\Formula;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class FormulaController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth')->except(['chapterFormular', 'show']);
	}

	public function index()
	{
		$formulas = Formula::with('chapter')->get();
		return Inertia::render('Formulas/FormulaIndex', [
			'formulas' => FormulaResource::collection($formulas		)
		]);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Formula[]|Collection
	 */
	public function chapterFormular(Chapter $chapter)
	{
		// Get the list of all formulas as JSON ?
		return [
			'formular' => FormulaResource::collection($chapter->formulas),
			'chapters' => $chapter->theme->chapters()
				->where('active', true)
				->has('formulas')
				->get()
				->map(function ($chapter) {
					return $chapter->only(['slug', 'title', 'theme_id']);
				})
				->concat(
					$chapter->relations()
						->has('formulas')
						->get()
						->map(function ($relation) {
							return $relation->only(['slug', 'title']);
						})
				)->unique('slug')
		];
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return RedirectResponse
	 */
	public function store(Chapter $chapter, Request $request)
	{
		// Get the number of formulas for this chapter
		$n = $chapter->formulas->count();
		// Create the post model
		$formula = $chapter->formulas()->create();
		$formula->blocks()->create([
			'body'  => 'A modifier...',
			'order' => $n + 1,
		]);

		$formula->blocks;

		// Return to the main root.
		return FormulaResource::make($formula);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param Formula $formula
	 * @return Formula
	 */
	public function show(Formula $formula)
	{
		return $formula;
	}


	public function updateOrder(Request $request)
	{
		foreach ($request[ 'order' ] as $value) {
			Formula::find($value[ 'id' ])?->update(['order' => $value[ 'order' ]]);
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
		Formula::destroy($id);

		return Redirect::back();
	}

	public function duplicate(Formula $formula)
	{
		$newFormula = $formula->replicate();
		$newFormula->push();
		$newFormula->blocks()->save($formula->blocks[ 0 ]->duplicate());

		return FormulaResource::make($newFormula);
	}
}
