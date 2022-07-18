<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostResource;
use App\Models\Chapter;
use App\Models\Illustration;
use App\Models\Post;
use Illuminate\Http\Request;

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

	public function store(Chapter $chapter, Request $request){
		$validation = $request->validate([
			'title'=>['string', 'min:2']
		]);

		// Create a new chapter and create a first block.
		$post = $chapter->posts()->create([
			'title'=>$validation['title'],
			'numberOfVisibleBlocks'=>0
		]);

		// Load the blocks, even if it's empty :)
		$post->blocks;
		return PostResource::make($post);
	}

	public function store_OLD(Chapter $chapter, Request $request)
	{
		$validation = $request->validate([
			'chapter' => ['required', 'exists:App\Models\Chapter,id'],
			'title' => ['max:255'],
			'body' => ['required', 'min:5'],
			'answer.body' => ['string', 'nullable'],
			'answer.checker' => ['string', 'nullable'],
			'walkthrough' => ['array'],
			'walkthrough.*.step' => ['string', 'min:3'],
			'walkthrough.*.resolution' => ['string', 'min:3'],
			'illustrations' => ['array'],
			'illustrations.*.title' => ['string', 'nullable'],
			'illustrations.*.type' => ['string'],
			'illustrations.*.code' => ['string'],
			'illustrations.*.parameters' => ['string', 'nullable'],
		]);


		// Create the post model
		$post = new Post();
		$post->chapter_id = $validation["chapter"];
		$post->title = $validation["title"];
		$post->body = $validation["body"];
		$post->save();

		// Add the answer
		if ($validation['answer']['body'] !== null) {
			$post->answer()->create([
				'body' => $validation['answer']['body'],
				'checker' => $validation['answer']['checker']
			]);
		}

		// Add the image
		foreach ($validation["illustrations"] as $item) {
			$illustration = new Illustration();
			$illustration->title = ''; //$item['title'];
			$illustration->type = $item['type'];
			$illustration->code = $item['code'];
			$illustration->parameters = ''; //$item['parameters'];
			$illustration->save();
			$post->illustrations()->attach($illustration);
		}

		// Add the walkthroughs
		foreach ($validation["walkthrough"] as $i => $step) {
			$walkthrough = new PostWalkthrough();
			$walkthrough->order = $i;
			$walkthrough->step = $step['step'];
			$walkthrough->resolution = $step['resolution'];
			$post->walkthrough()->save($walkthrough);
			// Eventually, add an illustration
//			if (count($step['illustrations'])) {
//				$illustration = new Illustration();
//				$illustration->title = $step['illustrations']['title'];
//				$illustration->type = $step['illustrations']['type'];
//				$illustration->code = $step['illustrations']['code'];
//				$illustration->parameters = $step['illustrations']['parameters'];
//
//				$walkthrough->illustrations()->attach($illustration);
//			}
		}

		$post->refresh();

		// Return to the main root.
		// Check the path as route
		return redirect()->route('chapters.show', [$chapter->slug]);
	}

	public function show(Post $post)
	{
//		return Inertia::render("Posts/PostShow", [
//			'theme' => $post->chapter->theme,
//			'post' => $post
//		]);
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
			'switch' => ['string', 'nullable']
			]);

		$post->title = $validation['title'];
		$post->script = $validation['script'] ?? '';
		$post->switch = $validation['switch'];
		$post->save();

		return $post;
	}

	public function updateNumberOfVisibleBlocks(Post $post, Request $request)
	{
		// Validate the post.
		$validation = $request->validate([
			'numberVisibleBlocks' => ['integer','between:0,100'],
		]);

		$post->numberOfVisibleBlocks = $validation['numberVisibleBlocks'];
		$post->save();

		return $post;
	}

	public function destroy($id)
	{
		Post::destroy($id);

		return true;
	}
}
