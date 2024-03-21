<?php

namespace App\Http\Controllers;

use App\Http\Resources\DeckResource;
use App\Http\Resources\FlipcardResource;
use App\Models\Deck;
use App\Models\Flipcard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeckController extends Controller
{
	private array $validationRules = [
		'slug' => ['string', 'min:3', 'required'],
		'title' => ['string', 'min:3', 'required']
	];

	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		return Inertia::render("Decks/DeckIndex", [
			'decks' => Deck::all()
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
	public function show(Deck $deck)
	{
		return Inertia::render("Decks/DeckShow", [
			'deck' => DeckResource::make($deck)
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Deck $deck)
	{
		return Inertia::render("Decks/DeckEdit", [
			'deck' => DeckResource::make($deck)
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

	public function addFlipcard(Deck $deck)
	{
		// Create the flipcard.
		$flipcard = $deck->flipcards()->create([]);

		// Add the corresponding blocks.
		$flipcard->blocks()->createMany(
			[
				['body' => ' recto '],
				['body' => ' verso ']
			]
		);


		return FlipcardResource::make($flipcard);
	}

	public function destroyFlipcard(Flipcard $flipcard)
	{
		$flipcard->delete();
	}
}
