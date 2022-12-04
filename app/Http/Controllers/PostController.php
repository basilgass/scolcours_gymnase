<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Chapter;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth')->except(['index', 'show']);
	}

	public function index()
	{
		// TODO : make a single post page view...
//		return Inertia::render("Tools", $data);
	}

	public function create(Chapter $chapter)
	{
		// Create a post form
//		return Inertia::render("Posts/PostForm", [
//			"theme" => $chapter->theme,
//			"chapter" => $chapter
//		]);
	}

	public function store(Chapter $chapter, Request $request)
	{
		$validation = $request->validate([
			'title' => ['string', 'min:2']
		]);

		$post = $chapter->posts()->create([
			'title' => $validation['title'],
			'numberOfVisibleBlocks' => 0,
			'position' => count($chapter->posts)
		]);

		// Load the blocks, even if it's empty :)
		$post->blocks;
		return PostResource::make($post);
	}

	public function show(Post $post)
	{
		return Inertia::render("Posts/PostShowNew", [
			'theme' => $post->chapter->theme,
			'post' => PostResource::make($post)
		]);
	}

	public function edit(Post $post)
	{
		// Create a post form
//		return Inertia::render("Posts/PostForm", [
//			"theme" => $post->chapter->theme,
//			"chapter" => $post->chapter,
//			'edit' => $post
//		]);
	}

	public function update(Post $post, Request $request)
	{
		// Validate the post.
		$validation = $request->validate([
			'title' => ['max:255'],
			'script' => ['string', 'nullable'],
			'switch' => ['string', 'nullable'],
			'type' => ['string', 'nullable']
		]);

		$post->title = $validation['title'];
		$post->script = $validation['script'] ?? '';
		$post->switch = $validation['switch'];
		$post->type = $validation['type'] ?? null;
		$post->save();

		return $post;
	}

	public function updateNumberOfVisibleBlocks(Post $post, Request $request)
	{
		// Validate the post.
		$validation = $request->validate([
			'numberVisibleBlocks' => ['integer', 'between:0,100'],
		]);

		$post->numberOfVisibleBlocks = $validation['numberVisibleBlocks'];
		$post->save();

		return $post;
	}

	public function updateBlocksOrder(Post $post, Request $request)
	{
		foreach ($request['data'] as $row) {
			$post->blocks->find($row['id'])->update(['order' => $row['order']]);
		}
	}

	public function updateQuestionsGrid(Post $post, Request $request)
	{
		$validate = $request->validate([
			'questionsGrid'=>['string', 'nullable']
		]);

		$post->update([
			'questionsGrid' => $validate['questionsGrid']??$validate['questionsGrid']
		]);
		$post->save();
		return true;
	}

	public function destroy($id)
	{
		$post = Post::find($id);
		if ($post) {
			$post->blocks()->delete();
		}

		Post::destroy($id);

		return true;
	}
}
