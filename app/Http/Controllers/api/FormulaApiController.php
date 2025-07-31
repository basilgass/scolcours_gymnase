<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TargetClassRequest;
use App\Http\Resources\FormulaResource;
use App\Models\Chapter;
use App\Models\Formula;
use App\Traits\CanMoveToTarget;
use App\Traits\ResolvesTarget;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class FormulaApiController extends Controller
{
	use ResolvesTarget;
	use CanMoveToTarget;

	public function index(Request $request)
	{
		if ($request->input('ids')) {
			return $this->fetch($request->input('ids'));
		}

		if ($request->input('chapter_id')) {
			$chapter = Chapter::find($request->input('chapter_id'));
			return FormulaResource::collection($chapter->formulas);
		}

		$formulas = Formula::with("chapter")->get();
		return FormulaResource::collection($formulas);
	}

	public function fetch($values)
	{
		$formulas = Formula::whereIn('id', $values)
		                   ->orderByRaw('FIELD(id,' . implode(",", $values) . ')')
		                   ->get();
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
		$formula = $chapter->formulas()->create([
			'order' => $n + 1
		]);

		$formula->blocks()->create([
			'body' => 'A modifier...'
		]);

		$formula->blocks;

		// Return to the main root.
		return FormulaResource::make($formula);
	}

	public function destroy(Formula $formula)
	{
		$formula->delete();
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
						'id'    => $chapter->id,
						//						'slug'  => $chapter->slug,
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
								//'slug'  => $relation->slug,
								'id'    => $relation->id,
								'title' => $relation->title,
								'theme' => [
									'id' => $relation->theme_id
								]
							];
						})->toArray()
				)->unique('id')
		];
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return \Illuminate\Http\Response
	 */


	public function updateOrder(Request $request)
	{
		foreach ($request['order'] as $value) {
			Formula::find($value['id'])?->update(['order' => $value['order']]);
		}

		return response()->noContent();
	}


	public function duplicate(Formula $formula)
	{
		$newFormula = $formula->replicate();
		$newFormula->push();
		$newFormula->blocks()->save($formula->blocks[0]->duplicate());

		return FormulaResource::make($newFormula);
	}

	public function move(Formula $formula, TargetClassRequest $request)
	{
		$target = $this->resolveTarget($request->validated());
		return $this->moveToTarget(
			$formula, 'formulas', $target, 'chapter'
		);
	}

}
