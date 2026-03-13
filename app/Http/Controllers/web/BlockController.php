<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlockResource;
use App\Models\Block;
use App\Traits\ResolvesTarget;
use Inertia\Inertia;

class BlockController extends Controller
{
	use ResolvesTarget;

	public function index()
	{
		return Inertia::render(
			'Blocks/admin/AdminBlock',
			[
				'blocks' => BlockResource::collection(Block::whereNotNull('script')->get())
			]
		);
	}

	public function show(Block $block)
	{
		// Redirection vers la route du parent selon son type
		return $block->redirectToBlockable();
	}

	public function edit(Block $block)
	{
		$blockable = $block->blockable;

		$theme = null;

		if (isset($blockable->theme)) {
			$theme = $blockable->theme;
		} elseif (isset($blockable->chapter)) {
			$theme = $blockable->chapter->theme;
		}


		return Inertia::render('Blocks/BlockEdit', [
			'theme' => $theme,
			'block' => BlockResource::make($block),
		]);
	}
}
