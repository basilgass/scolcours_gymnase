<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderRequest;
use App\Http\Requests\StoreBlockRequest;
use App\Http\Requests\TargetClassRequest;
use App\Http\Requests\UpdateBlockRequest;
use App\Http\Resources\BlockResource;
use App\Models\Block;
use App\Traits\ResolvesTarget;
use Inertia\Inertia;

class BlockController extends Controller
{
	use ResolvesTarget;

	public function show(Block $block)
	{
		// Redirection vers la route du parent selon son type
		return $block->redirectToBlockable();
	}

	public function edit(Block $block)
	{
		return Inertia::render('Blocks/BlockEdit', [
			'block'=>BlockResource::make($block),
		]);
	}
}
