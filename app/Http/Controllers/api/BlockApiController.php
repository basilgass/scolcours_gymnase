<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderRequest;
use App\Http\Requests\StoreBlockRequest;
use App\Http\Requests\TargetClassRequest;
use App\Http\Requests\UpdateBlockRequest;
use App\Http\Resources\BlockResource;
use App\Models\Block;
use App\Traits\ResolvesTarget;

class BlockApiController extends Controller
{
	use ResolvesTarget;

	public function index()
	{
		// TODO: API Block index ?
		return response()->noContent();
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

		return true;
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
		$blockable = $this->resolveTarget($request->validated());

		$block->update([
			'blockable_id'   => $blockable->id,
			'blockable_type' => get_class($blockable),
			'order'          => count($blockable->blocks) + 2
		]);

		$block->refresh();

		return [
			'url'   => $blockable->url,
			'label' => $blockable->title,
		];
	}
}
