<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlockResource;
use App\Models\Block;
use App\Models\Chapter;
use App\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BlockController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth');
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param Request $request
	 * @return Block|Model
	 */
	public function store(Request $request)
	{
		$validation = $request->validate([
			'target' => ['string'],
			'target_id' => ['number'],
			'title' => ['string', 'nullable'],
			'body' => ['required', 'min:5'],
			'template' => ['string', 'nullable'],
			'script' => ['string', 'nullable'],
			'switch' => ['boolean', 'nullable'],
			'json' => ['string', 'nullable']
		]);

		$block = Block::create([
			'title' => $request->title,
			'body' => $request->body,
			'template' => $request->template,
			'script' => $request->script,
			'json' => $request->json,
			'switch' => $request->switch,
			'data' => $request->data
		]);

		$this->storeInBlockable($request->target, $request->target_id, $block);
//		if ($request->target === 'Chapter') {
//			Chapter::get($request->target_id)?->append($block);
//		} elseif ($request->target === 'Post') {
//			Post::get($request->target_id)?->append($block);
//		}

		return $block;
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	public function storeInBlockable(string $target, int $target_id, Block $block)
	{
		if ($target === 'Chapter') {
			Chapter::get($target_id)?->append($block);
		} elseif ($target === 'Post') {
			Post::get($target_id)?->append($block);
		}
	}

	public function storeInPost(Post $post, Request $request)
	{
		$block = $post->blocks()->create([
			'title' => '',
			'body' => 'sans contenu',
			'order' => count($post->blocks)
		]);

		return BlockResource::make($block);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param int $id
	 * @return RedirectResponse
	 */
	public function show(Block $block)
	{
		// Redirect to the post / show item
		$post = $block->blockable;
		$chapter = $post->chapter;
		$theme = $chapter->theme;
		return redirect()->route(
			'theme.chapter.slide.block',
			[
				$theme->slug, $chapter->slug, $post->order, $block->id
			]
		);
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param int $id
	 * @return \Inertia\Response
	 */
	public function edit(Block $block)
	{
		//
		return Inertia::render("Devs/Edit/BlockEditPage", [
			'block' => BlockResource::make($block)
		]);
	}

	public function toggleblur(Request $request, Block $block)
	{
		$validation = $request->validate([
			'blur' => ['boolean', 'required']
		]);

		$block->blur = $validation['blur'];
		$block->save();
		return $block;
	}

	public function toggleswitch(Request $request, Block $block)
	{
		$validation = $request->validate([
			'switch' => ['boolean', 'nullable']
		]);

		$block->switch = $validation['switch'];
		$block->save();
		return $block;
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return RedirectResponse
	 */
	public function destroy($id)
	{
		Block::destroy($id);

		return Redirect::back();
	}

	public function fetchComponents()
	{
		$components = [];

		foreach (Storage::disk('illustrations')->allFiles() as $file) {
			// read it and grab the md text.
			$content = explode("<info>", Storage::disk('illustrations')->get($file));
			$theme_name = explode("/", $file);
			$theme = "";
			$name = basename($file, '.vue');
			if(count($theme_name)===2){
				$theme = $theme_name[0];
			}

			$components[$file] = [
				"name" => $name,
				"description" => count($content) >= 2 ? explode("</info>", $content[1])[0] : "",
				"theme" => $theme
			];

		}
		return $components;
	}

	public function updateIllustrationsOrder(Block $block, Request $request)
	{
		foreach ($request['order'] as $value) {
			$block->illustrations->find($value['id'])->update(['order' => $value['order']]);
		}

		return true;

	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param Request $request
	 * @param int $id
	 * @return BlockResource
	 */
	public function update(Request $request, Block $block)
	{
		$validation = $request->validate([
			'title' => ['nullable', 'max:255'],
			'body' => ['nullable'],
			'template' => ['string', 'nullable'],
			'type' => ['string', 'nullable'],
			'script' => ['string', 'nullable'],
			'json' => ['string', 'nullable'],
			'blur' => ['boolean'],
			'switch' => ['boolean', 'nullable'],
		]);

		$block->title = $validation['title'] ?? '';
		$block->body = $validation['body'] ?? null;
		$block->template = $validation['template'] ?? null;
		$block->type = $validation['type'] ?? '';
		$block->script = $validation['script'] ?? null;
		$block->json = $validation['json'] ?? null;
		$block->blur = $validation['blur'] ?? false;
		$block->switch = $validation['switch'] ?? null;

		// update the block
		$block->save();
		$block->update();

		// Return the updated block
		return BlockResource::make($block);
	}

	public function updateTemplate(Block $block, Request $request)
	{
		$validate = $request->validate([
			'template' => ['string', 'nullable']
		]);

		$block->update([
			'template' => $validate['template'] ?? $validate['template']
		]);

		return true;
	}

	public function moveBlockToPost(Block $block, Post $post)
	{
		// remove the block from the current blockable.
		$block->update([
			'blockable_id' => $post->id,
			'order' => count($post->blocks) + 2
		]);

		return [
			'url' => $post->url,
			'label' => $post->title,
		];
	}

	public function updateIllustrationsGrid(Block $block, Request $request)
	{
		$validate = $request->validate([
			'grid' => ['string', 'nullable']
		]);

		$block->update([
			'illustrationsGrid' => $validate['grid'] ?? $validate['grid']
		]);
		$block->save();
		return true;
	}
}
