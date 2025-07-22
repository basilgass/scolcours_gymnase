<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\updateCardRequest;
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
		// Validate the request.
		if ($request->reference_block_id) {
			$card = $deck->cards()->create([
				'order'                    => $deck->cards()->count(),
				'reference_block_id'       => $request->reference_block_id,
				'reference_block_splitter' => $request->reference_block_splitter ?? null
			]);
		} else {
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
		}

		return CardResource::make($card);
	}

	public function update(updateCardRequest $request, Card $card)
	{
		$blocks = $request->input('blocks');

		foreach (['recto', 'verso'] as $side) {
			$card->blocks()->where('id', $blocks[$side]['id'])->update([
				'body' => $blocks[$side]['body'],
			]);
		}

		return CardResource::make($card);
	}

	// REFACTOR: this update must be for the students !

	public function destroy(Card $card)
	{
		$card->delete();
		return response()->noContent();
	}

	public function updateCard(Request $request, Card $card)
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
}
