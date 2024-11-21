<?php

namespace App\Http\Controllers;

use App\Http\Resources\BlockResource;
use App\Models\Block;
use App\Models\Chapter;
use App\Models\Post;
use App\Models\Question;
use Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BlockController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth');
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
			'target'    => ['string'],
			'target_id' => ['number'],
			'title'     => ['string', 'nullable'],
			'body'      => ['required', 'min:5'],
			'template'  => ['string', 'nullable'],
			'script'    => ['string', 'nullable'],
			'switch'    => ['boolean', 'nullable'],
			'json'      => ['string', 'nullable']
		]);

		$block = Block::create([
			'title'    => $request->title,
			'body'     => $request->body,
			'template' => $request->template,
			'script'   => $request->script,
			'json'     => $request->json,
			'switch'   => $request->switch,
			'data'     => $request->data
		]);

		$this->storeInBlockable($request->target, $request->target_id, $block);

		return $block;
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
		$validation = $request->validate([
			'after'     => ['int', 'nullable', 'min:0'],
		]);


		// If the "after" key was given:
		// we need to reorder the blocks from the post
		// and include the new one after the given value.
		if ($request->after !== null) {
			// Get the blocks from the post
			$blocks = $post->blocks;

			// Create the new block
			$block = $post->blocks()->create([
				'title' => '',
				'body'  => 'sans contenu',
				'order' => $request->after + 1
			]);

			// Insert the new block at the given index
			$blocks->splice($request->after + 1, 0, [$block]);

			// Reorder the blocks
			$blocks->each(function ($b, $index) {
				$b->update(['order' => $index]);
			});

			$block->refresh();
		} else {
			// Create the new block, add it at the end of the post.
			$block = $post->blocks()->create([
				'title' => '',
				'body'  => 'sans contenu',
				'order' => count($post->blocks)
			]);
		}

		return BlockResource::make($block);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param int $id
	 * @return RedirectResponse
	 */
	public function show(int $id)
	{
        // find the post from the current block and redirect to this post.


		// Redirect to the post / show item
		$post = $block->blockable;
        $post->load(['chapter', 'chapter.theme']);
        if ($post instanceof Question) {
            $post = $post->questionable;
        }

//        $chapter = $post->chapter;
//		$theme = $chapter->theme;


		if ($post instanceof Post) {
			return redirect()->route(
				'themes.chapters.slide.anchor',
				[
					'theme'   => $post->chapter->theme->slug,
					'chapter' => $post->chapter->slug,
					'order'   => $post->order,
					'type'    => 'block',
					'id'      => $block->id
				]
			);
		} else {
			return redirect()->route(
				'chapters.show',
				[
					'chapter' => $chapter->slug
				]
			);
		}
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param int $id
	 * @return Response
	 */
	public function edit(Block $block)
	{
		$post = $block->blockable;
		if ($post instanceof Question) {
			$post = $post->questionable;
		}

		return Inertia::render("Blocks/BlockEdit", [
			'theme' => $post->chapter?->theme,
			'block' => BlockResource::make($block),
		]);
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
		// Get the blockable item.
		$parent = Block::find($id)->blockable;

		// Delete the block
		Block::destroy($id);

		return $parent->url;
	}

	public function fetchWidgets()
	{
		return Cache::rememberForever('widgets', function () {
			$components = [];

			foreach (Storage::disk('illustrations')->allFiles() as $file) {
				// read it and grab the md text.
				$content = explode("<info>", Storage::disk('illustrations')->get($file));
				$theme_name = explode("/", $file);
				$theme = "";
				$name = basename($file, '.vue');
				if (count($theme_name) === 2) {
					$theme = $theme_name[0];
				}

				$components[$file] = [
					"name"        => $name,
					"description" => count($content) >= 2 ? explode("</info>", $content[1])[0] : "",
					"theme"       => $theme
				];
			}
			return $components;
		});
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
			'title'             => ['nullable', 'max:255'],
			'body'              => ['nullable'],
			'template'          => ['string', 'nullable'],
			'type'              => ['string', 'nullable'],
			'script'            => ['string', 'nullable'],
			'json'              => ['string', 'nullable'],
			'blur'              => ['boolean', 'nullable'],
			'switch'            => ['boolean', 'nullable'],
			'illustrationsGrid' => ['string', 'nullable']
		]);

		$block->title = $validation['title'] ?? '';
		$block->body = $validation['body'] ?? null;
		$block->template = $validation['template'] ?? null;
		$block->type = $validation['type'] ?? '';
		$block->script = $validation['script'] ?? null;
		$block->json = $validation['json'] ?? null;
		$block->switch = $validation['switch'] ?? null;
		$block->illustrationsGrid = $validation['illustrationsGrid'] ?? null;

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
			'order'        => count($post->blocks) + 2
		]);

		return [
			'url'   => $post->url,
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

	public function move(Block $block, Request $request)
	{
		$validate = $request->validate([
			'direction' => ['string', 'required', 'in:top,bottom,up,down'],
		]);

		// Get the post
		$blocks = collect();
		$blocks = $block->consolidateBlocksOrder();

		// Get the index of the block
		$index = $blocks->find($block)->order;

		// Get the new index
		if ($validate['direction'] === 'top') {
			$newIndex = 0;
		} else if ($validate['direction'] === 'bottom') {
			$newIndex = count($blocks) - 1;
		} else if ($validate['direction'] === 'up') {
			$newIndex = $index - 1;
		} else {
			$newIndex = $index + 1;
		}

		// Move the block
		$blocks->splice($index, 1);
		$blocks->splice($newIndex, 0, [$block]);

		// Update the order
		$blocks->each(function ($block, $index) {
			$block->update(['order' => $index]);
		});

		return BlockResource::collection($blocks);
	}
}
