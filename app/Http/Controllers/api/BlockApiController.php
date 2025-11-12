<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderRequest;
use App\Http\Requests\StoreBlockRequest;
use App\Http\Requests\TargetClassRequest;
use App\Http\Requests\UpdateBlockRequest;
use App\Http\Resources\BlockResource;
use App\Models\Block;
use App\Models\Chapter;
use App\Traits\CanMoveToTarget;
use App\Traits\ResolvesTarget;
use Illuminate\Http\Request;

class BlockApiController extends Controller
{
	use ResolvesTarget;
	use CanMoveToTarget;

	public function index(Request $request)
	{
		if ($request->input('ids')) {
			return $this->fetch($request->input('ids'));
		}

		if ($request->input('chapter_id')) {
			$chapter = Chapter::find($request->input('chapter_id'));
			return BlockResource::collection($chapter->blocks);
		}

		// TODO: If no data given, must use pagination, as there are two many blocks ?
		return response()->noContent();
		//		return BlockResource::collection($blocks);
	}

	public function fetch($values)
	{
		$blocks = Block::whereIn('id', $values)
		               ->orderByRaw('FIELD(id,' . implode(",", $values) . ')')
		               ->get();

		return BlockResource::collection($blocks);
	}

	public function show(Block $block)
	{
		return BlockResource::make($block);
	}

	public function store(StoreBlockRequest $request)
	{
		$validated = $request->validated();

		$blockable = $this->resolveTarget($validated);

		return $blockable->blocks()->create($validated);
	}

	public function destroy(Block $block): string|bool
	{
		$parent = $block->blockable;

		$block->delete();

		if (property_exists($parent, 'url')) {
			return $parent->url;
		}

		return response()->noContent();
	}

	public function updatePartial(UpdateBlockRequest $request, Block $block)
	{
		$block->update($request->validated());

		return $block;
	}

	public function update(UpdateBlockRequest $request, Block $block)
	{
		$validated = $request->validated();

		if (isset($validated['order'])) {
			$newOrder = $validated['order'];

			// Incrémente order >= newOrder sauf le block actuel
			Block::where('blockable_id', $block->blockable_id)
			     ->where('blockable_type', $block->blockable_type)
			     ->where('order', '>=', $newOrder)
			     ->where('id', '<>', $block->id)
			     ->increment('order');
		}

		$block->update($validated);

		// change the updated_at value of the blockable
		$block->blockable->touch();

		// Return the updated block
		return BlockResource::make($block);
	}

	public function reorderIllustrations(Block $block, ReorderRequest $request)
	{
		$request->setModelTable('illustrations');
		$validated = $request->validated();

		foreach ($validated['order'] as $value) {
			$block->illustrations()->where('id', $value['id'])->update(['order' => $value['order']]);
		}

		return response()->noContent();
	}

	public function move(Block $block, TargetClassRequest $request)
	{
		$target = $this->resolveTarget($request->validated());
		return $this->moveToTarget(
			$block, 'blocks', $target, 'blockable'
		);

		$blockable = $this->resolveTarget($request->validated());

		$maxOrder = $blockable->blocks()->max('order') ?? 0;

		$block->blockable()->associate($blockable);
		$block->order = $maxOrder + 1;
		$block->save();

		return [
			'url'   => $blockable->url,
			'label' => $blockable->title,
		];
	}

	public function fetchBlockableUrl(Block $block)
	{
		return $block->redirectUrl();
	}

	public function storeIllustration(Block $block)
	{

	}
}
