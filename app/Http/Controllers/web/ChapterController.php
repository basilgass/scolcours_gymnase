<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\ChapterShowResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostShowResource;
use App\Http\Resources\ThemeResource;
use App\Models\Block;
use App\Models\Chapter;
use App\Models\Illustration;
use App\Models\Post;
use App\Models\Question;
use App\Models\Theme;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChapterController extends Controller
{
	public function index(Theme $theme)
	{
		if (Auth::User()?->admin) {
			$chapters = $theme
				->chapters()
				->with('blocks', 'blocks.illustrations')
				->orderBy('active', 'DESC')
				->orderBy('title', 'ASC')
				->get();
		} else {
			$chapters = $theme
				->chapters()
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

	public function show(Theme $theme, Chapter $chapter)
	{
		$chapter->load(
			[
				'blocks',
				'posts' => function ($query) {
					if (Auth::user()?->admin) {
						$query->withCounts(); //->where('active', true);
					} else {
						$query->withCounts()->where('active', true);
					}
				},
				'challenges',
				'relations'
			]
		);

		return Inertia::render('Chapters/ChapterShow', [
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
					'id'       => $relation->id,
					'slug'     => $relation->slug,
					'title'    => $relation->title,
					'theme_id' => $relation->theme_id
				];
			}),
		]);
	}

	public function edit(Chapter $chapter)
	{
		return Inertia::render('Chapters/ChapterEdit', [
			'chapter' => ChapterResource::make($chapter)
		]);
	}

	public function slide(Theme $theme, Chapter $chapter, int $order, string $type = null, int $id = null)
	{
		//		$chapter->load(
		//			[
		//				'posts' => function ($query) {
		//					if (Auth::user()?->admin) {
		//						$query->withCounts(); //->where('active', true);
		//					} else {
		//						$query->withCounts()->where('active', true);
		//					}
		//				},
		//				'posts.blocks',
		//				'posts.blocks.illustrations',
		//				'posts.questions',
		//				'posts.questions.blocks',
		//				'posts.questions.blocks.illustrations',
		//			]
		//		);
		//
		//		$post = $chapter->posts->where('order', "=", $order)->first();

		$post = Post::where('chapter_id', $chapter->id)
		            ->where('order', $order)
		            ->when(!Auth::user()?->admin, function ($query) {
			            $query->where('active', true);
		            })
		            ->firstOrFail();
		$post->load([
			'blocks.illustrations',
			'questions',
			'questions.blocks.illustrations'
		]);

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

		$chapter->load([
			"posts"=>function ($query) {
				if (Auth::user()?->admin) {
					$query->withCounts(); //->where('active', true);
				} else {
					$query->withCounts()->where('active', true);
				}
			}
		]);

		return Inertia::render('Chapters/ChapterPostShow', [
			// Get the chapter (for next / previous / ...)
			"chapter" => fn() => ChapterResource::make($chapter),
			// Utilisé pour la navigation et le menu.
			"posts"   => fn() => PostResource::collection($chapter->posts),
			// The post information
			"post"    => PostShowResource::make($post),
			// Block for a scroll to
			"anchor"  => $anchor,
		]);
	}


	// TO BE REMOVED

	public function download(string $filename)
	{
		return Storage::disk('public')->download('/pdf/' . $filename);
	}
}
