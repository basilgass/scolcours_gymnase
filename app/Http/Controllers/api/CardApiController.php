<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CardResource;
use App\Models\Card;
use App\Models\Deck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CardApiController extends Controller
{

	public function index(Deck $deck)
	{
		return CardResource::collection($deck->cards);
	}

	public function show(Card $card)
	{
		return CardResource::make($card);
	}

	public function store(Request $request, Deck $deck)
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

	public function update(Request $request, Card $card)
	{
		$validated = $request->validate([
			'current_score'       => ['numeric'],
			'current_appearances' => ['integer'],
			'current_time_spent'  => ['integer'],
			'appearances'         => ['integer'],
			'success'             => ['integer'],
			'time_spent'          => ['integer'],
		]);

		$score = $card->scoreFor(Auth::user());
		if ($score) {
			$score->data = $validated;
			$score->save();
		}

		return CardResource::make($card);
	}

	public function fetch(string $values)
	{
		$cards = Card::whereIn('id', explode(',', $values))
		             ->orderByRaw('FIELD(id,' . $values . ')')
		             ->get();
		return CardResource::collection($cards);
	}


	public function destroy(Card $card)
	{
		$card->delete();
		return response()->noContent();
	}
}
