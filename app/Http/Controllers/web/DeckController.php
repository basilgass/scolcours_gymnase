<?php

namespace App\Http\Controllers\web;

use App\Http\Controllers\Controller;
use App\Http\Resources\DeckResource;
use App\Models\Deck;
use Inertia\Inertia;

class DeckController extends Controller
{

	public function index()
	{
		if (\Auth::user()?->admin) {
			$decks = Deck::withCount('cards')->get();
		} else {
			$decks = Deck::withCount('cards')->where('active', 1)->get();
		}

		return Inertia::render("Decks/DeckIndex",
			[
				'decks' => DeckResource::collection($decks)
			]
		);
	}

	public function show(Deck $deck)
	{
		$cards = $deck->cards;

		if (auth()->check()) {
			$userId = auth()->id();

			// Load the deck score
			$deck->load([
				'scoreForAuth',
				'cards.scoreForAuth'
			]);

			if (!$deck->scores->first()) {
				$score = $deck->scores()->create([
					'user_id' => $userId,
					'score'   => 0
				]);
			}

			// Load the cards score
			//			$cards->load([
			//				'scores' => function ($query) use ($userId) {
			//					$query->where('user_id', $userId);
			//				}
			//			]);

			// Créer les scores manquants
			foreach ($cards as $card) {
				if (!$card->scores->first()) {
					$score = $card->scores()->create([
						'user_id' => $userId,
						'score'   => 0,
					]);

					$score->data = [
						"current_score"       => 0,
						"current_appearances" => 0,
						"current_time_spent"  => 0,
						"appearances"         => 0,
						"success"             => 0,
						"time_spent"          => 0,
					];

					$score->save();
				}
			}

			// Recharger les scores après création
			// TODO: removed the load here !
			//			$cards->load([
			//				'scores' => function ($query) use ($userId) {
			//					$query->where('user_id', $userId);
			//				}
			//			]);
		}

		return Inertia::render("Decks/DeckShow", [
			'deck' => DeckResource::make($deck)
		]);
	}


	public function edit(Deck $deck)
	{
		$deck->load('cards');
		// Get the cards of the deck.
		return Inertia::render("Decks/DeckEdit", [
			'deck' => DeckResource::make($deck),
		]);
	}


	public function portfolio(Deck $deck)
	{
		return Inertia::render('Decks/DeckPortfolio', [
			"deck" => DeckResource::make($deck),
		]);
	}
}
