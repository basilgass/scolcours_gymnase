<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeckRequest;
use App\Http\Requests\ReorderRequest;
use App\Http\Resources\DeckResource;
use App\Models\Chapter;
use App\Models\Deck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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


	public function fetchAvailableDecks()
	{
		$decks = Deck::withCount('cards')
		             ->get();

		$formulars = Chapter::withCount('formulas')
		                    ->has('formulas')->get();

		// Reformat data to match everything.
		// -> [
		// id: number
		// type: Deck | Formula | Chapter
		// title: string
		// cards_count: number
		//]

		$output = [];
		foreach ($decks as $deck) {
			$output[] = [
				'id'          => $deck->id,
				'type'        => 'Deck',
				'theme_id'    => 0,
				'title'       => $deck->title,
				'cards_count' => $deck->cards_count
			];
		}

		foreach ($formulars as $deck) {
			$output[] = [
				'id'          => $deck->id,
				'type'        => 'Formular',
				'theme_id'    => $deck->theme_id,
				'title'       => $deck->title,
				'cards_count' => $deck->formulas_count
			];
		}


		return [
			"decks" => $output
		];
	}

	public function createUserDeck(Request $request)
	{
		$validated = $request
			->validate([
				'title'       => ['string', 'min:5'],
				'description' => ['string', 'nullable'],
				'decks'       => ['Array'],
				'decks.id'    => ['int'],
				'decks.type'  => ['string'] // Can only by Deck|Formular|Chapter
			]);

		// Check the user
		$user = Auth::user();
		if (!$user?->exists) {
			return false;
		}

		// Regroup tous les résultats par type.
		$formularIds = array_column(array_filter($validated['decks'], fn($deck) => $deck['type'] === 'Formular'), 'id');
		$deckIds = array_column(array_filter($validated['decks'], fn($deck) => $deck['type'] === 'Deck'), 'id');
		$chapterIds = array_column(array_filter($validated['decks'], fn($deck) => $deck['type'] === 'Chapter'), 'id');

		$cards = [];

		if (count($formularIds) > 0) {
			// append to $cards
			$cards = array_merge($cards, Chapter::whereIn('id', $formularIds)
			                                    ->with('formulas')->get()
			                                    ->pluck('formulas')->flatten()
			                                    ->unique()
			                                    ->map(function ($id) {
				                                    return ['id' => $id->id, 'type' => 'App\Models\Formula'];
			                                    })->toArray()
			);
		}

		if (count($deckIds) > 0) {
			// append to $cards
			$cards = array_merge($cards, Deck::whereIn('id', $deckIds)->with('cards')->get()
			                                 ->pluck('cards')->flatten()
			                                 ->unique()
			                                 ->map(function ($id) {
				                                 return ['id' => $id->id, 'type' => 'App\Models\Card'];
			                                 })->toArray()
			);
		}

		if (count($chapterIds) > 0) {
			// append to $cards
			$cards = array_merge($cards, Chapter::whereIn('id', $chapterIds)
			                                    ->with('blocks')->get()
			                                    ->pluck('blocks')->flatten()
			                                    ->unique()
			                                    ->map(function ($id) {
				                                    return ['id' => $id->id, 'type' => 'App\Models\Block'];
			                                    })->toArray()
			);
		}


		// Create a new userdeck
		$userdeck = $user->decks()->create([
			'title'       => $validated['title'],
			'description' => $validated['description'] ?? ''
		]);

		// Assign the cards.
		foreach ($cards as $card) {
			$userdeck
				->cards()
				->create([
					'cardable_type' => $card['type'],
					'cardable_id'   => $card['id']
				]);
		}


		return true;
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
