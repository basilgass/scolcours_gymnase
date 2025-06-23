<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\IllustrationResource;
use App\Models\Illustration;
use App\Models\Question;
use Inertia\Inertia;

class IllustrationController extends Controller
{

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
				"illustration" => IllustrationResource::make($illustration)
			]
		);
	}
}
