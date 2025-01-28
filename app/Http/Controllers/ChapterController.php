<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlockResource;
use App\Http\Resources\ChallengeResource;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\ChapterShowResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostShowResource;
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
				->with('blocks', 'blocks.illustrations')
				->orderBy('active', 'DESC')
				->orderBy('title', 'ASC')
				->get();
		} else {
			$chapters = $theme->chapters()
				->with('blocks', 'blocks.illustrations')
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
		return ChapterResource::collection(Chapter::all()->sortBy(['theme_id', 'title']));
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
	}

	public function create(Theme $theme)
	{
	}


	public function intro(Theme $theme, Chapter $chapter)
	{

		// TODO: Optimize DB access ->load(...) make more than 10 queries
		$chapter->load([
						   'blocks',
						   'posts' => function ($query) {
							   $query->withCounts()->where('active', true);
						   },
						   'challenges',
						   'relations'
					   ]);

		return Inertia::render('Chapters/ChapterShow', [
			// Used for the page layout
			"theme"      => ThemeResource::make($theme),
			// Get the chapter (for next / precvious / ...)
			"chapter"    => fn() => ChapterShowResource::make($chapter),
			// Get the posts.
			"posts"      => fn() => PostResource::collection($chapter->posts),
			// Get the challenges.
			"challenges" => fn() => $chapter->challenges->map(function ($challenge) {
				return [
					'id'    => $challenge->id,
					'slug'  => $challenge->slug,
					'title' => $challenge->title
				];
			}),
			// Get the relations.
			"relations"  => fn() => $chapter->relations->map(function ($relation) {
				return [
					'id'    => $relation->id,
					'slug'  => $relation->slug,
					'title' => $relation->title,
					'theme' => ['id' => $relation->theme_id]
				];
			}),
		]);
	}

	public function slide(Theme $theme, Chapter $chapter, int $order, string $type = null, int $id = null)
	{
		$chapter->load([
						   'posts' => function ($query) {
							   $query->withCounts()->where('active', true);
						   },
						   'posts.blocks',
						   'posts.questions',
						   'posts.questions.blocks',
						   'challenges',
						   'relations'
					   ]);

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
			"chapter" => fn() => ChapterResource::make($chapter),
			"posts"   => fn() => PostResource::collection($chapter->posts),
			// The post information
			"post"    => PostShowResource::make($post),
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
		$chapter->delete();
		return true;
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
			"posts" => PostShowResource::collection($chapter->posts->sortBy("order"))
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

		return ChapterResource::collection($chapter->relations);
	}

	public function getTheoremsFromChapter(Chapter $chapter)
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
