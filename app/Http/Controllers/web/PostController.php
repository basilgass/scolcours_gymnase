<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Traits\ResolvesTarget;
use Inertia\Inertia;

class PostController extends Controller
{
	use ResolvesTarget;

	public function show(Post $post)
	{
		// Find the chapter for this post and redirect to it !
		return redirect(route('themes.chapters.posts.show', [
			$post->chapter->theme,
			$post->chapter,
			$post->order
		]));
	}

	public function edit(Post $post)
	{
		$post->unsetRelation('blocks');
		$post->unsetRelation('questions');

		// Create a post form
		return Inertia::render("Posts/PostEdit", [
			'post' => $post
		]);
	}

}
