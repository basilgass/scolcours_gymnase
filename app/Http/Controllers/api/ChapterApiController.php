<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlockResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\PostShowResource;
use App\Models\Chapter;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ChapterApiController extends Controller
{
	public function index(Request $request, Theme $theme = null)
	{
		if ($theme) {
			// appelée via /api/themes/{theme}/chapters
			return ChapterResource::collection($theme->chapters);
		}

		// appelée via /api/chapters
		$query = Chapter::query();

		if ($request->filled('ids')) {
			$ids = explode(',', $request->input('ids'));
			$query->whereIn('id', $ids);
		}

		$query->orderBy('title');

		return ChapterResource::collection($query->get());
	}

	public function store(Theme $theme, Request $request)
	{
		$request->merge([
			'slug' => Str::slug($request->title)
		]);

		$validated = $request->validate([
			'title' => ['string', 'required', 'min:2'],
			'slug'  => ['string', 'unique:chapters,slug']
		]);


		$chapter = $theme->chapters()->create([
			'title' => $validated['title'],
			'slug'  => $validated['slug'],
		]);

		// Create a specific block
		$chapter->blocks()->create([
			'body' => 'Aucune extrait...'
		]);

		return $chapter;
	}


	public function destroy(Chapter $chapter)
	{
		$chapter->delete();
		return true;
	}

	public function updatePostsOrder(Chapter $chapter, Request $request)
	{
		$validated = $request->validate([
			"posts"         => ["array"],
			"posts.*.id"    => ['required', 'exists:App\Models\Post,id'],
			"posts.*.order" => ['required', "int", 'min:1']
		]);
		foreach ($validated['posts'] as $row) {
			$chapter->posts->find($row['id'])->update(['order' => $row['order']]);
		}

		return [
			"posts" => PostShowResource::collection($chapter->posts->sortBy("order"))
		];
	}

	public function update(Request $request, Chapter $chapter)
	{
		$validated = $request->validate([
			'title'      => ['required', 'min:2', 'max:255'],
			'meta_title' => ['nullable', 'min:2', 'max:255'],
			'slug'       => ['required', 'min:1', 'max:255'],
		]);

		$chapter->title = $validated['title'];
		$chapter->meta_title = $validated['meta_title'] ?? null;
		$chapter->slug = $validated['slug'];
		$chapter->save();

		// Save the corresponding block!
		$block = $chapter->blocks[0];
		$validated = $request->validate([
			'block'      => ['array'],
			'block.body' => ['string'],
		]);

		$block->update([
			'body' => $validated['block']['body']
		]);

		// Refresh the chapter model
		$chapter->refresh();

		// Return the chapter
		return ChapterResource::make($chapter);
	}

	public function updateCurrentPost(Chapter $chapter, Request $request)
	{
		$user = Auth::user();

		if ($user?->exists) {

			$validate = $request->validate(
				[
					'post_id' => ['required', 'exists:App\Models\Post,id'],
				]
			);

			$user->chapters()->detach($chapter->id);
			$user->chapters()->attach(
				$chapter,
				[...$validate]
			);
		}
	}

	public function toggleRelated(Chapter $chapter, Chapter $related)
	{
		if ($chapter->id === $related->id) {
			return false;
		}
		// update it !
		if ($chapter->relations->contains($related)) {
			$chapter->relations()->detach($related);
		} else {
			$chapter->relations()->attach($related);
		}
		$chapter->refresh();

		return ChapterResource::collection($chapter->relations);
	}

	public function getTheoremsFromChapter(Chapter $chapter)
	{
		// Get all [theorem / propreties and definition] blocks from all post in the chapter.
		$blocks = $chapter->posts
			->map(function ($post) {
				return $post->blocks;
			})
			->flatten()
			->filter(function ($block) {
				return $block->type === "theorem" or $block->type === "definition" or $block->type === "property";
			});

		return BlockResource::collection($blocks);
	}

	// Get basic info about chapter
	public function info(Chapter $chapter)
	{
		return [
			"title" => $chapter->title,
		];
	}
}
