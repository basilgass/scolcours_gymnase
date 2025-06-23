<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FormulaResource;
use App\Models\Chapter;
use App\Models\Formula;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FormulaApiController extends Controller
{
	public function index()
	{
		$formulas = Formula::with("chapter")->get();
		return FormulaResource::collection($formulas);
	}

	public function show(Formula $formula)
	{
		return FormulaResource::make($formula);
	}

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

	public function destroy(Formula $formula)
	{
		$formula->delete();
	}

	public function fetch(string $values)
	{
		$formulas = Formula::whereIn('id', explode(',', $values))
		                   ->orderByRaw('FIELD(id,' . $values . ')')
		                   ->get();
		return FormulaResource::collection($formulas);
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Formula[]|Collection
	 */
	public function getFormulasFromChapter(Chapter $chapter)
	{
		return [
			'formular' => FormulaResource::collection($chapter->formulas),
			'chapters' => $chapter->theme
				->chapters()
				->where('active', true)
				->has('formulas')
				->get()
				->map(function ($chapter) {
					return [
						'slug'  => $chapter->slug,
						'title' => $chapter->title,
						'theme' => [
							'id' => $chapter->theme_id
						]
					];
				})
				->concat(
					$chapter
						->relations()
						->has('formulas')
						->get()
						->map(function ($relation) {
							return [
								'slug'  => $relation->slug,
								'title' => $relation->title,
								'theme' => [
									'id' => $relation->theme_id
								]
							];
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


	public function updateOrder(Request $request)
	{
		foreach ($request['order'] as $value) {
			Formula::find($value['id'])?->update(['order' => $value['order']]);
		}

		return true;
	}


	public function duplicate(Formula $formula)
	{
		$newFormula = $formula->replicate();
		$newFormula->push();
		$newFormula->blocks()->save($formula->blocks[0]->duplicate());

		return FormulaResource::make($newFormula);
	}
}
