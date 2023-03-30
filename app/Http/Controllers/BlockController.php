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
			'template' => ['string', 'nullable'],
			'type' => ['string', 'nullable'],
			'script' => ['string', 'nullable'],
			'json' => ['string', 'nullable'],
			'blur' => ['boolean'],
			'switch' => ['boolean', 'nullable'],
//			'illustrations' => ['array', 'nullable'],
//			'illustrations.*.id' => ['integer', 'nullable'],
//			'illustrations.*.title' => ['string', 'nullable'],
//			'illustrations.*.type' => ['string'],
//			'illustrations.*.code' => ['string'],
//			'illustrations.*.parameters' => ['string', 'nullable'],
//			'illustrations.*.css' => ['string', 'nullable']
		]);

		$block->title = $validation['title'] ?? '';
		$block->body = $validation['body'];
		$block->template = $validation['template']??null;
		$block->type = $validation['type'] ?? '';
		$block->script = $validation['script'] ?? null;
		$block->json = $validation['json'] ?? null;
		$block->blur = $validation['blur'] ?? false;
		$block->switch = $validation['switch'] ?? null;

		// Get all illustrations IDs.
		// TODO: remove illustration handle from block
//		if(count($validation['illustrations'])===0){
//			// remove all illustrations (we don't want anymore !)
//			$block->illustrations()->delete();
//		}else{
//			// Add all illustrations
//			$block->illustrations()
//				->whereNotIn(
//					'id',
//					collect($validation['illustrations'])->pluck('id')
//				)->delete();
//
//			foreach ($validation['illustrations'] as $i=>$illustration) {
//				$illustration['order'] = $i+1;
//				$block->illustrations()->updateOrCreate(
//					["id"=>$illustration['id']],
//					$illustration
//				);
//			}
//		}

		// update the block
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
			// read it and grab the md text.
			$content = explode("<info>", Storage::disk('illustrations')->get($file));
			$components[basename($file, '.vue')] = count($content) >= 2 ? explode("</info>", $content[1])[0] : "";
			
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
}
