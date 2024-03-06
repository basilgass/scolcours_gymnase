<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\Illustration;
use App\Models\Widget;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
	 * Store a newly created resource in storage.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @return \Illuminate\Database\Eloquent\Model
	 */
	public function store(Block $block, Request $request)
	{
		$validation = $request->validate([
			'code'=>['string', 'nullable'],
			'parameters'=>['string', 'nullable'],
			'widget_id'=>['exists:App\Models\Widget,id', 'nullable']
		]);

		if(isset($validation['widget_id'])){
			$widget = Widget::find($validation['widget_id'])->first();
		}else{
			$widget = Widget::where('slug','draw-parser-widget')->first();
		}

		// creates an empty illustration.
		$illustration = $block->illustrations()->create([
			'code' => '',
			'parameters' => '',
			'type'=>'',
			'widget_id' => $widget->id
		]);

		return Illustration::find($illustration->id);
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
	 * @return \Inertia\Response
     */
	public function edit(Illustration $illustration)
	{
		return Inertia::render("Devs/Edit/IllustrationEditPage",
			["illustration" => $illustration]
		);
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @param int $id
	 * @return Illustration|\Illuminate\Http\Response
	 */
	public function update(Request $request, Illustration $illustration)
	{
		$validation = $request->validate([
			'title' => ['string', 'nullable'],
			'css' => ['string', 'nullable'],
			'code' => ['string'],
			'parameters' => ['string', 'nullable'],
			'widget_id'=>['exists:App\Models\Widget,id'],
//			'value'=>['string'],
//			'type'=>['string'],
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
			'image' => ['required', 'image', 'max:2048'],
		]);

		$uploadedFile = $request->file('image');

		// Upload the image.
		$filename = time() . '-' . $uploadedFile->getClientOriginalName();

		return \Storage::disk('public')->putFileAs(
			'illustrations', $uploadedFile, $filename
		);

	}
}
