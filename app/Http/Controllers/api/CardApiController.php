<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\updateCardRequest;
use App\Http\Resources\CardResource;
use App\Models\Card;
use App\Models\Deck;
use Illuminate\Http\Request;

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
		$data = $request->validated();

		// It's a dynamic card
		if ($card->reference_block and !empty($data['splitter'])) {
			$card->reference_block_splitter = $data['splitter'];
			$card->save();
		} elseif (!empty($data['blocks'])) {
			$blocks = $data['blocks'];

			foreach (['recto', 'verso'] as $side) {
				if (!isset($blocks[$side]['id'], $blocks[$side]['body'])) {
					continue;
				}

				$card
					->blocks()
					->where('id', $blocks[$side]['id'])
					->update([
						'body' => $blocks[$side]['body'],
					]);
			}

		}

		$card->refresh();
		return CardResource::make($card);
	}

	// REFACTOR: this update must be for the students !

	public function destroy(Card $card)
	{
		$card->delete();
		return response()->noContent();
	}

	public function fetch(string $values)
	{
		$cards = Card::whereIn('id', explode(',', $values))
		             ->orderByRaw('FIELD(id,' . $values . ')')
		             ->get();
		return CardResource::collection($cards);
	}
}
