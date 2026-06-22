<?php

namespace Database\Factories;

use App\Models\Block;
use App\Models\Card;
use App\Models\Deck;
use Illuminate\Database\Eloquent\Factories\Factory;

class CardFactory extends Factory
{
    protected $model = Card::class;

    public function definition(): array
    {
        return [
            'deck_id' => Deck::factory(),
            'order'   => 0,
        ];
    }

    /**
     * Reproduit CardApiController::store : une carte « normale » porte
     * exactement deux blocks (recto / verso), requis par CardResource::hasBlocks().
     * Une carte « dynamique » (reference_block_id défini) n'en porte aucun.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Card $card): void {
            if ($card->reference_block_id === null) {
                $card->blocks()->createMany([
                    ['body' => ' recto '],
                    ['body' => ' verso '],
                ]);
            }
        });
    }

    /**
     * Rattache la carte à un deck donné.
     */
    public function forDeck(Deck $deck): static
    {
        return $this->state(fn (array $attributes): array => [
            'deck_id' => $deck->getKey(),
        ]);
    }

    /**
     * Carte dynamique adossée à un block de référence (pas de recto/verso propres).
     */
    public function withReferenceBlock(Block $block): static
    {
        return $this->state(fn (array $attributes): array => [
            'reference_block_id' => $block->getKey(),
        ]);
    }
}
