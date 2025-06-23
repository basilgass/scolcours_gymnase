<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderRequest;
use App\Http\Requests\TargetClassRequest;
use App\Http\Resources\PostShowResource;
use App\Models\Chapter;
use App\Models\Post;
use App\Traits\ResolvesTarget;
use Illuminate\Http\Request;

class PostApiController extends Controller
{
	use ResolvesTarget;

	public function index()
	{
	}

	public function show(Post $post)
	{
		return PostShowResource::make($post);
	}

	public function store(Request $request)
	{
		$validated = $request->validate([
			'title'      => ['required', 'string', 'min:2'],
			'chapter_id' => ['required', 'exists:App\Models\Chapter,id'],
		]);

		$chapter = Chapter::find($validated['chapter_id']);


		$post = $chapter->posts()->create([
			'title' => $validated['title'],
			'order' => count($chapter->posts) + 1
		]);

		// Load the blocks, even if it's empty :)
		$post->blocks;

		return PostShowResource::make($post);
	}

	public function destroy(Post $post)
	{
		$chapter = $post->chapter;
		// Remove all children blocks.
		$post->blocks()->delete();

		// Destroy the post
		$post->delete();

		// Update the posts order.
		$chapter->reorder();

		return response()->noContent();
	}



	public function reorderBlocks(Post $post, ReorderRequest $request)
	{
		$request->setModelTable('blocks');
		$validated = $request->validated();

		foreach ($validated['order'] as $value) {
			$post->blocks->find($value['id'])->update(['order' => $value['order']]);
		}

		return response()->noContent();
	}

	public function reorderQuestions(Post $post, ReorderRequest $request)
	{
		$request->setModelTable('questions');
		$validated = $request->validated();

		foreach ($validated['order'] as $value) {
			$post->questions->find($value['id'])->update(['order' => $value['order']]);
		}

		return response()->noContent();
	}

	public function update(Post $post, Request $request)
	{
		// Validate the post.
		$validated = $request->validate([
			'title'         => ['max:255'],
			'active'        => ['boolean'],
			'script'        => ['string', 'nullable'],
			'switch'        => ['string', 'nullable'],
			'type'          => ['string', 'nullable'],
			'questionsGrid' => ['string', 'nullable'],
		]);

		$post->title = $validated['title'];
		$post->active = $validated['active'];
		$post->script = $validated['script'] ?? '';
		$post->switch = $validated['switch'];
		$post->type = $validated['type'] ?? null;
		$post->questionsGrid = $validated['questionsGrid'] ?? null;
		$post->save();

		return PostShowResource::make($post);
	}

	public function updateQuestionsGrid(Post $post, Request $request)
	{
		$validate = $request->validate([
			'grid' => ['string', 'nullable']
		]);

		$post->update([
			'questionsGrid' => $validate['grid'] ?? $validate['grid']
		]);
		$post->save();

		return response()->noContent();
	}

	public function resetAnswers(Post $post)
	{
		foreach ($post->questions as $question) {
			$question->resetAnswer();
		}

		return response()->noContent();
	}

	public function move(Post $post, TargetClassRequest $request)
	{
		$chapter = $this->resolveTarget($request->validated());

		$post->update([
			'chapter_id' => $chapter->id,
			'order'      => count($chapter->posts) + 2
		]);

		$post->refresh();

		return [
			'url'   => $chapter->url,
			'label' => $chapter->title,
		];
	}

	// Get basic info about a post
	public function info(Post $post)
	{
		return [
			"title" => $post->title,
		];
	}


}
