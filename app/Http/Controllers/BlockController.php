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
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
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
			'script' => ['string', 'nullable'],
			'switch' => ['boolean', 'nullable'],
			'json' => ['string', 'nullable'],
			'illustrations' => ['array'],
			'illustrations.*.title' => ['string', 'nullable'],
			'illustrations.*.type' => ['string'],
			'illustrations.*.code' => ['string'],
			'illustrations.*.parameters' => ['text', 'nullable'],
		]);

		$block = Block::create([
			'title' => $request->title,
			'body' => $request->body,
			'script' => $request->script,
			'json' => $request->json,
			'switch' => $request->switch,
			'data' => $request->data
		]);

		if (count($request->illustrations) > 0) {
			foreach ($request->illustrations as $item) {
				$block->illustrations()->create([
					'title' => $item['title'] ?? '',
					'type' => $item['type'],
					'code' => $item['code'],
					'parameters' => $item['parameters']
				]);
			}
		}

		if ($request->target === 'Chapter') {
			Chapter::get($request->target_id)?->append($block);
		} elseif ($request->target === 'Post') {
			Post::get($request->target_id)?->append($block);
		}

		return $block;
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
	 * @return Response
	 */
	public function show($id)
	{
		//
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
			'body' => ['required'],
			'type' => ['string', 'nullable'],
			'script' => ['string', 'nullable'],
			'json' => ['string', 'nullable'],
			'blur' => ['boolean'],
			'switch' => ['boolean', 'nullable'],
			'illustrations' => ['array', 'nullable'],
			'illustrations.*.title' => ['string', 'nullable'],
			'illustrations.*.type' => ['string'],
			'illustrations.*.code' => ['string'],
			'illustrations.*.parameters' => ['string', 'nullable']
		]);

		$block->title = $validation['title'] ?? '';
		$block->body = $validation['body'];
		$block->type = $validation['type'] ?? '';
		$block->script = $validation['script'] ?? null;
		$block->json = $validation['json'] ?? null;
		$block->blur = $validation['blur'] ?? false;
		$block->switch = $validation['switch'] ?? null;


		// Remove all illustrations
		$block->illustrations()->delete();

		// Get all items.
		if (count($validation['illustrations']) > 0) {
			// Add all illustrations
			foreach ($validation['illustrations'] as $illustration) {
				$block->illustrations()->create($illustration);
			}
		}
		$block->save();
		$block->update();

		// Return the updated block
		return BlockResource::make($block);
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
		foreach (Storage::disk('illustrations')->files() as $file) {
			$components[] = basename($file, '.vue');
		}
		return $components;
	}

}
