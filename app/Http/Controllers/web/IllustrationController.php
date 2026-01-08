<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\IllustrationResource;
use App\Models\Illustration;
use Inertia\Inertia;

class IllustrationController extends Controller
{

	public function index()
	{
		return IllustrationResource::collection(Illustration::all());
	}

	public function edit(Illustration $illustration)
	{
		// Get the post (or anything) containing the illustration
		$parent = $illustration->block->blockable;

		// If the blockable is a post, extract the chapter and theme.
		//		if ($parent instanceof Question) {
		//			$parent = $parent->questionable;
		//		}

		return Inertia::render(
			"Illustrations/IllustrationEdit",
			[
				"illustration" => IllustrationResource::make($illustration),
				"parent"       => [
					"id"   => $parent->id,
					"type" => class_basename($parent)
				]
			]
		);
	}
}
