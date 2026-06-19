<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeckRequest;
use App\Http\Requests\ReorderRequest;
use App\Http\Resources\DeckResource;
use App\Models\Deck;
use Illuminate\Http\Request;

class DeckApiController extends Controller
{

	public function index()
	{
		$decks = Deck::withCount('cards')->get();

		return DeckResource::collection($decks);
	}

	public function show(Deck $deck)
	{
		$deck->load('cards.scoreForAuth');
		return DeckResource::make($deck);
	}

	public function store(DeckRequest $request): DeckResource
	{
		$deck = Deck::create($request->validated());

		return DeckResource::make($deck);
	}


	public function destroy(Deck $deck)
	{
		Deck::destroy($deck->id);

		return response()->noContent();
	}

	public function reorderCards(Deck $deck, ReorderRequest $request)
	{
		$request->setModelTable('cards');
		$validated = $request->validated();

		foreach ($validated['order'] as $value) {
			$deck->cards
				->find($value['id'])
				->update(['order' => $value['order']]);
		}

		return response()->noContent();
	}

	public function update(DeckRequest $request, Deck $deck): DeckResource
	{
		// Validate the deck
		$deck->update($request->validated());

		return DeckResource::make($deck->fresh());
	}

	public function updateChapter(Request $request, Deck $deck)
	{
		$validated = $request->validate([
			'chapter_id' => ['required', 'exists:chapters,id']
		]);

		$deck->chapter()->associate($validated['chapter_id']);

		$deck->save();

		return $validated['chapter_id'];
	}

	public function toggleActive(Request $request, Deck $deck)
	{
		$validated = $request->validate([
			'active' => ['required', 'boolean']
		]);

		$deck->active = $validated['active'];
		$deck->save();

		return response()->noContent();

	}

}
