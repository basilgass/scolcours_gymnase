<?php

namespace App\Http\Controllers;

use App\Http\Resources\FormulaResource;
use App\Models\Chapter;
use App\Models\Formula;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class FormulaController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth')->except(['index', 'show']);
	}

	/**
     * Display a listing of the resource.
     *
     * @return Formula[]|Collection
	 */
    public function index(Chapter $chapter)
    {
		// Get the list of all formulas as JSON ?
		return FormulaResource::collection($chapter->formulas);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RedirectResponse
	 */
    public function store(Chapter $chapter, Request $request)
    {
//		$validation = $request->validate([
//			'chapter_id' => ['required', 'exists:App\Models\Chapter,id'],
//			'formula' => ['required', 'max:255'],
//			'comment' => []
//		]);

		// Create the post model
		$formula = $chapter->formulas()->create();
		$formula->blocks()->create([
			'body'=>'A modifier...'
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

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  int  $id
     * @return Formula
	 */
    public function update(Formula $formula, Request $request)
    {
//		$validation = $request->validate([
//			'formula' => ['required', 'max:255'],
//			'comment' => []
//		]);
//
//		$formula->update($validation);
//		$formula->save();

		return $formula;
    }

	public function updateOrder(Request $request)
	{
		foreach ($request['order'] as $value){
			Formula::find($value['id'])?->update(['order'=>$value['order']]);
		}

		return true;
	}

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
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
		$newFormula->blocks()->save($formula->blocks[0]->duplicate());

		return FormulaResource::make($newFormula);
	}
}
