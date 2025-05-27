<?php

namespace App\Http\Controllers;

use App\Http\Resources\CardResource;
use App\Http\Resources\UserCardResource;
use App\Http\Resources\UserDeckResource;
use App\Models\Card;
use App\Models\Chapter;
use App\Models\Deck;
use App\Models\UserCard;
use App\Models\UserDeck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

		return Inertia::render("Decks/UserdeckIndex", [
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
		return Inertia::render("Decks/UserdeckShow", [
			'deck'  => UserDeckResource::make($deck),
			'cards' => UserCardResource::collection($deck->cards)
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Deck $deck)
	{
		// Get the cards of the deck.

		$deck->cards;
		return Inertia::render("Decks/DeckEdit", [
			'deck'  => $deck,
			'cards' => CardResource::collection($deck->cards)
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

	public function updateCard(UserCard $card): UserCardResource
	{
		$validation = request()->validate([
											  'current_score'       => ['numeric'],
											  'current_appearances' => ['integer'],
											  'current_time_spent'  => ['integer'],
											  'appearances'         => ['integer'],
											  'success'             => ['integer'],
											  'time_spent'          => ['integer'],
										  ]);

		$card->update($validation);

		return UserCardResource::make($card);
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
		$validation = $request
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
		$formularIds = array_column(array_filter($validation['decks'], fn($deck) => $deck['type'] === 'Formular'), 'id');
		$deckIds = array_column(array_filter($validation['decks'], fn($deck) => $deck['type'] === 'Deck'), 'id');
		$chapterIds = array_column(array_filter($validation['decks'], fn($deck) => $deck['type'] === 'Chapter'), 'id');

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
											   'title'       => $validation['title'],
											   'description' => $validation['description'] ?? ''
										   ]);

		// Assign the cards.
		foreach ($cards as $card) {
			$userdeck->cards()
				->create([
							 'cardable_type' => $card['type'],
							 'cardable_id'   => $card['id']
						 ]);
		}


		return true;
	}

	public function destroyUserDeck(UserDeck $deck)
	{
		$deck->delete();

		return true;
	}

	public function portfolio(UserDeck $deck)
	{
		return Inertia::render('Decks/UserdeckPortfolio', [
			"deck"  => UserDeckResource::make($deck),
			'cards' => UserCardResource::collection($deck->cards)
		]);
	}
}
