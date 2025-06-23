<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IllustrationRequest;
use App\Models\Block;
use App\Models\Illustration;
use Illuminate\Http\Request;

class IllustrationApiController extends Controller
{
	public function show(Illustration $illustration)
	{
		// Redirect to the post / show item
		$block = $illustration->block;

		return $block->redirectToBlockable();
	}

	public function store(Block $block, IllustrationRequest $request)
	{
		$illustration = $block->illustrations()->create($request->validated());

		$block->touch();

		return $illustration->fresh();
	}

	public function update(IllustrationRequest $request, Illustration $illustration)
	{
		$illustration->update($request->validated());

		// change the updated_at of the block
		$illustration->block->touch();

		return $illustration->fresh();
	}

	public function destroy(Illustration $illustration): string
	{
		// Get the url of the block containing the illustration
		$block = $illustration->block;
		$illustration->delete();

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
