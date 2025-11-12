<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Models\Block;
use App\Models\Lesson;
use App\Models\Post;
use App\Traits\ResolvesTarget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
	use ResolvesTarget;

	public function show(Post $post, Request $request)
	{
		$context = $request->query('context');

		if ($context and $context === 'course') {
			$user = Auth::user();

			$lesson = Lesson::whereHasMorph(
				'lessonable',
				Post::class,
				function ($q) use ($post) {
					$q->where('id', $post->id);
				})
			                ->first();

			// TODO: actuellemnt, la redirection vers le lesson ne gère que le dernier - on doit aller dans le même cours que le cours en cours !!!!
			return redirect(route('students.lessons.show', [
				"course" => $lesson->course,
				"lesson" => $lesson
			]));
		}


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

	public function anchor(Post $post, Block $block)
	{
		return redirect(route('themes.chapters.posts.anchor', [
			$post->chapter->theme,
			$post->chapter,
			$post->order,
			'block',
			$block->id
		]));
	}

}
