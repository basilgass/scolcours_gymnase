<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\Chapter;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class BlockController extends Controller
{
	public function __construct()
	{
		$this->middleware('auth');
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		//
	}

	/**
	 * Show the form for creating a new resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @return Block|\Illuminate\Database\Eloquent\Model
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
			'illustrations.*.parameters' => ['string', 'nullable'],
		]);

		$block = Block::create([
			'title' => $request->title,
			'body' => $request->body,
			'script' => $request->script,
			'json' => $request->json,
			'switch' =>$request->switch,
			'data' => $request->data
		]);

		if (count($request->illustrations) > 0) {
			foreach ($request->illustrations as $item) {
				$block->illustrations()->create([
					'title' => '',
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
		$validation = $request->validate([
			'n'=>['integer', 'between:1,10']
		]);

		$createdBlocks = [];
		for($i=0; $i<$validation['n']; $i++){
			$block = $post->blocks()->create([
				'title'=>'',
				'body' => 'sans contenu',
				'order'=> count($post->blocks)
			]);

			$createdBlocks[] = Block::find($block->id);
		}

		return $createdBlocks;
	}


	/**
	 * Display the specified resource.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @param int $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, Block $block)
	{
		$validation = $request->validate([
			'title'=>['nullable', 'max:255'],
			'body' =>['required'],
			'type' =>['string', 'nullable'],
			'script'=>['string', 'nullable'],
			'json'=>['string', 'nullable'],
			'blur'=>['boolean'],
			'switch'=>['boolean', 'nullable'],
			'illustrations'=>['array', 'nullable'],
			'illustrations.*.title' => ['string', 'nullable'],
			'illustrations.*.type' => ['string'],
			'illustrations.*.code' => ['string'],
			'illustrations.*.parameters' => ['string', 'nullable']
		]);

		$block->title = $validation['title'];
		$block->body = $validation['body'];
		$block->type = $validation['type']??'';
		$block->script = $validation['script'];
		$block->json = $validation['json'];
		$block->blur = $validation['blur'];
		$block->switch = $validation['switch'];

		// Remove all illustrations
		$block->illustrations()->delete();
		if(count($validation['illustrations'])>0){
			// Add all illustrations
			foreach($validation['illustrations'] as $illustration){
				$block->illustrations()->create($illustration);
			}
		}

		$block->save();
		return $block;
	}

	public function toggleblur(Request $request, Block $block)
	{
		$validation = $request->validate([
			'blur'=>['boolean','required']
		]);

		$block->blur = $validation['blur'];
		$block->save();
		return $block;
	}

	public function toggleswitch(Request $request, Block $block)
	{
		$validation = $request->validate([
			'switch'=>['boolean','nullable']
		]);

		$block->switch = $validation['switch'];
		$block->save();
		return $block;
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param int $id
	 * @return \Illuminate\Http\RedirectResponse
	 */
	public function destroy($id)
	{
		Block::destroy($id);

		return Redirect::back();
	}
}
