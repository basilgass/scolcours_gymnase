<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Formula;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class FormulaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
		$validation = $request->validate([
			'chapter_id' => ['required', 'exists:App\Models\Chapter,id'],
			'formula' => ['required', 'max:255'],
			'comment' => []
		]);

		// Create the post model
		$formula = Formula::create($validation);

		// Return to the main root.
		return Redirect::back();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Formula::destroy($id);

		return Redirect::back();
    }

	/**
	 * @param Chapter $chapter
	 * @return \Illuminate\Database\Eloquent\Relations\HasMany
	 */
	public function fetch(Chapter $chapter)
	{
		return $chapter->formulas;
	}
}
