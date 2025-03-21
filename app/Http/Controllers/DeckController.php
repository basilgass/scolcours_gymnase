<?php

namespace App\Http\Controllers;

use App\Http\Resources\CardResource;
use App\Http\Resources\UserCardResource;
use App\Http\Resources\UserDeckResource;
use App\Models\Card;
use App\Models\Deck;
use App\Models\UserDeck;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeckController extends Controller
{

	private array $validationRules = [
		'slug'  => ['string', 'min:3', 'required'],
		'title' => ['string', 'min:3', 'required']
	];

	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		// Get the user decks.
		$userDecks = \Auth::user()?->decks ?? [];

		return Inertia::render("Decks/DeckIndex", [
			'decks' => UserDeckResource::collection($userDecks)
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(Request $request): \Illuminate\Database\Eloquent\Model|Deck
	{
		// Validation for the new deck
		$validation = $request->validate($this->validationRules);

		$deck = Deck::create($validation);

		return $deck;
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		//
	}

	/**
	 * Display the specified resource.
	 */
	public function show(UserDeck $deck)
	{
		return Inertia::render("Decks/DeckShow", [
			'deck' => UserDeckResource::make($deck),
			'cards' => UserCardResource::collection($deck->cards)
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Deck $deck)
	{
		return Inertia::render("Decks/DeckEdit", [
			'deck' => UserDeckResource::make($deck)
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(Request $request, Deck $deck): Deck
	{
		// Validate the deck
		$validation = $request->validate($this->validationRules);

		$deck->update($validation);

		return $deck;
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Deck $deck): void
	{
		Deck::destroy($deck->id);
	}

	public function addCard(Deck $deck)
	{
		// Create the card.
		$card = $deck->cards()->create([
										   'order' => $deck->cards()->count()
									   ]);

		// Add the corresponding blocks.
		$card->blocks()->createMany(
			[
				['body' => ' recto '],
				['body' => ' verso ']
			]
		);


		return CardResource::make($card);
	}

	public function destroyCard(Card $card)
	{
		$card->delete();
	}

	public function updateOrder(Request $request)
	{
		foreach ($request['order'] as $value) {
			Card::find($value['id'])?->update(['order' => $value['order']]);
		}

		return true;
	}

	public function assignChapter(Request $request, Deck $deck)
	{
		$validation = $request->validate([
											 'chapter_id' => ['required', 'exists:chapters,id']
										 ]);

		$deck->chapter()->associate($validation['chapter_id']);

		$deck->save();

		return $validation['chapter_id'];
	}

	public function getCards(string $values)
	{
		$cards = Card::whereIn('id', explode(',', $values))
			->orderByRaw('FIELD(id,' . $values . ')')
			->get();
		return CardResource::collection($cards);
	}
}
