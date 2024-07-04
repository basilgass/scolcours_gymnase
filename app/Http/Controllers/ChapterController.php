<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlockResource;
use App\Http\Resources\ChapterMinResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\ChapterShowResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\ThemeResource;
use App\Models\Block;
use App\Models\Chapter;
use App\Models\Illustration;
use App\Models\Question;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ChapterController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth')->except(['index', 'show', 'slide', 'intro']);
	}

	public function index(Theme $theme)
	{
		if (Auth::User()?->admin) {
			$chapters = $theme->chapters()
				//				->with('challenges')
				->orderBy('active', 'DESC')
				->orderBy('title', 'ASC')
				->get();
		} else {
			$chapters = $theme->chapters()
				//				->with('challenges')
				->where('active', true)
				->get();
		}

		// Filter output.
		$data = [
			"theme"    => ThemeResource::make($theme),
			"chapters" => ChapterShowResource::collection($chapters)
		];

		return Inertia::render("Chapters/ChapterIndex", $data);
	}

	public function indexMin()
	{
		// Should be admin only
		return ChapterMinResource::collection(Chapter::all()->sortBy(['theme_id', 'title']));
	}

	public function store(Theme $theme, Request $request)
	{
		$request->merge([
			'slug' => Str::slug($request->title)
		]);

		$validation = $request->validate([
			'title' => ['string', 'required', 'min:2'],
			'slug'  => ['string', 'unique:chapters,slug']
		]);


		$chapter = $theme->chapters()->create([
			'title' => $validation['title'],
			'slug'  => $validation['slug'],
		]);

		// Create a specific block
		$chapter->blocks()->create([
			'body' => 'Aucune extrait...'
		]);

		return $chapter;
		//		return redirect()->route('themes.chapters.intro', [$theme->slug, $chapter->slug]);
	}

	public function create(Theme $theme)
	{
		// TODO: route is disabled - does not exist anymore !
		//		return Inertia::render("Chapters/ChapterCreate",[
		//			"theme" => $theme->only('color', 'icon', 'slug', 'title', 'id')
		//		]);
	}


	public function intro(Theme $theme, Chapter $chapter)
	{
		return Inertia::render('Chapters/ChapterShow', [
			// Used for the page layout
			"theme"   => ThemeResource::make($theme),
			// Get the chapter (for next / precvious / ...)
			"chapter" => fn () => ChapterResource::make($chapter, true),
		]);
	}

	public function slide(Theme $theme, Chapter $chapter, int $order, string $type = null, int $id = null)
	{
		$post = $chapter->posts->where('order', "=", $order)->first();

		$anchor = null;
		if ($type !== null && $id !== null) {
			// Get the model.
			$model = null;
			if ($type === 'block') {
				$model = Block::find($id);
			} else if ($type === 'illustration') {
				$model = Illustration::find($id);
			} else if ($type === 'question') {
				$model = Question::find($id);
			}
			$anchor = sprintf("%s-%s", $type, $model->id);
		}

		return Inertia::render('Posts/PostShow', [
			// Used for the page layout
			"theme"   => ThemeResource::make($theme),
			// Get the chapter (for next / previous / ...)
			"chapter" => fn () => ChapterResource::make($chapter, true),
			// The post information
			"post"    => PostResource::make($post),
			// Block for a scroll to
			"anchor"  => $anchor,
		]);
	}

	public function edit(Chapter $chapter)
	{
		return Inertia::render('Chapters/ChapterEdit', [
			'theme'   => ThemeResource::make($chapter->theme),
			'chapter' => ChapterResource::make($chapter)
		]);
	}

	public function destroy(Chapter $chapter)
	{
		//
	}

	public function updatePostsOrder(Chapter $chapter, Request $request)
	{
		$validation = $request->validate([
			"posts"         => ["array"],
			"posts.*.id"    => ['required', 'exists:App\Models\Post,id'],
			"posts.*.order" => ['required', "int", 'min:1']
		]);
		foreach ($validation['posts'] as $row) {
			$chapter->posts->find($row['id'])->update(['order' => $row['order']]);
		}

		return [
			"posts" => PostResource::collection($chapter->posts->sortBy("order"))
		];
	}

	public function update(Request $request, Chapter $chapter)
	{
		$validation = $request->validate([
			'title'      => ['required', 'min:2', 'max:255'],
			'meta_title' => ['nullable', 'min:2', 'max:255'],
			'slug'       => ['required', 'min:1', 'max:255'],
		]);

		$chapter->title = $validation['title'];
		$chapter->meta_title = $validation['meta_title'] ?? null;
		$chapter->slug = $validation['slug'];
		$chapter->save();

		// Save the corresponding block!
		$block = $chapter->blocks[0];
		$validation = $request->validate([
			'block'      => ['array'],
			'block.body' => ['string'],
		]);

		$block->update([
			'body' => $validation['block']['body']
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

			$validate = $request->validate([
				'post_id' => ['required', 'exists:App\Models\Post,id'],
				'open'    => ['boolean', "nullable"]
			]);

			$user->chapters()->detach($chapter->id);
			$user->chapters()->attach(
				$chapter,
				[...$validate]
			);
		}
	}

	// TO BE REMOVED
	public function download(string $filename)
	{
		return Storage::disk('public')->download('/pdf/' . $filename);
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

		return ChapterMinResource::collection($chapter->relations);
	}

	public function theorems(Chapter $chapter)
	{
		// Get all [theorem / propreties and definition] blocks from all post in the chapter.
		$blocks = $chapter->posts->map(function ($post) {
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
