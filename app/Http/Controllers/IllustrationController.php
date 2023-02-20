<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\Illustration;
use Illuminate\Http\Request;

class IllustrationController extends Controller
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
	 * @param \Illuminate\Http\Request $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Block $block, Request $request)
	{
		// creates an empty illustration.
		$illustration = $block->illustrations()->create([
			'code' => '',
			'parameters' => '',
			'type' => 'draw'
		]);
		return $illustration;
	}

	/**
	 * Display the specified resource.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @param int $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, Illustration $illustration)
	{
		$validation = $request->validate([
			'title' => ['string', 'nullable'],
			'type' => ['string'],
			'value' => ['string', 'nullable'],
			'code' => ['string'],
			'parameters' => ['string', 'nullable'],
			'css' => ['string', 'nullable'],
		]);

		$illustration->update($validation);

		return $illustration;
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return true
	 */
	public function destroy($id)
	{
		Illustration::destroy($id);

		return $id;
	}

	public function upload(Request $request)
	{
		$validate = $request->validate([
			'image'=>['required', 'image', 'max:2048'],
		]);

		$uploadedFile = $request->file('image');

		// Upload the image.
		$filename = time().'-'.$uploadedFile->getClientOriginalName();

		return \Storage::disk('public')->putFileAs(
			'illustrations', $uploadedFile, $filename
		);

	}
}
