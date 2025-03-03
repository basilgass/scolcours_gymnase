<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\Illustration;
use App\Models\Question;
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
			'code' => ['string', 'nullable'],
			'parameters' => ['string', 'nullable'],
			'widget_id' => ['exists:App\Models\Widget,id', 'nullable']
		]);

		if (isset($validation['widget_id'])) {
			$widget = Widget::find($validation['widget_id'])->first();
		} else {
			$widget = Widget::where('slug', 'draw-parser-widget')->first();
		}

		// creates an empty illustration.
		$illustration = $block->illustrations()->create([
			'code' => '',
			'parameters' => '',
			'type' => '',
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
	 * @return \Illuminate\Http\RedirectResponse
	 */
	public function show(Illustration $illustration)
	{
		// Redirect to the post / show item
		$block = $illustration->block;
		$post = $block->blockable;
		$chapter = $post->chapter;
		$theme = $chapter->theme;
		return redirect()->route(
			'themes.chapters.slide.anchor',
			[
				'theme' => $theme->slug,
				'chapter' => $chapter->slug,
				'order' => $post->order,
				'type' => 'illustration',
				'id' => $illustration->id
			]
		);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param int $id
	 * @return \Inertia\Response
	 */
	public function edit(Illustration $illustration)
	{
		// Get the post (or anything) containing the illustration
		$post = $illustration->block->blockable;

		// If the blockable is a post, extract the chapter and theme.
		if ($post instanceof Question) {
			$post = $post->questionable;
		}

		return Inertia::render(
			"Illustrations/IllustrationEdit",
			[
				"theme" => $post->chapter?->theme,
				"illustration" => $illustration
			]
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
			'code' => ['string', 'nullable'],
			'parameters' => ['string', 'nullable'],
			'widget_id' => ['exists:App\Models\Widget,id'],
		]);

		// if code is null, change it to empty string.
		if ($validation['code'] === null) {
			$validation['code'] = '';
		}

		$illustration->update($validation);

		// change the updated_at of the block
		$illustration->block->touch();

		// change the updated_at of the blockable
		$illustration->block->blockable->touch();


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
		// Get the url of the block containing the illustration
		$block = Illustration::find($id)->block;
		Illustration::destroy($id);

		return $block->url;
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
			'illustrations',
			$uploadedFile,
			$filename
		);
	}
}
