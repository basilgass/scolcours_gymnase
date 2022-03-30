<?php

namespace App\Http\Controllers;

use App\Models\Chapter;
use App\Models\Illustration;
use App\Models\Post;
use App\Models\PostTemplate;
use App\Models\PostWalkthrough;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
	public function index()
	{
//		return Inertia::render("Tools", $data);
	}

	public function fetch(Chapter $chapter){
		return $chapter->posts->load('template');
	}

	public function create(Chapter $chapter)
	{
		// Create a basic post
		return Inertia::render("Posts/CreatePost", [
			"theme" => $chapter->theme,
			"chapter" => $chapter,
			'templates' => PostTemplate::all()
		]);
	}

	public function store(Request $request)
	{
		$validation = $request->validate([
			'chapter' => ['required', 'exists:App\Models\Chapter,id'],
			'title' => ['max:255'],
			'body' => ['required', 'min:5'],
			'template.id' => ['required', 'exists:App\Models\PostTemplate,id'],
			'template.parameters' => ['string', 'nullable'],
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
		$post->post_template_id = $validation['template']['id'];
		$post->post_template_params = $validation['template']['parameters'];
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
		return Inertia::render("Posts/CreatePost");
	}

	public function show(Post $post)
	{
		return Inertia::render("Posts/ViewPost", [
			'theme' => $post->chapter->theme,
			'template' => $post->template,
			'post' => $post
		]);
	}

	public function edit(Chapter $chapter)
	{
		//
	}

	public function update(Request $request, Chapter $chapter)
	{
		//
	}

	public function destroy(Chapter $chapter)
	{
		//
	}
}
