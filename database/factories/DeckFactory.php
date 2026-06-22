<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\Deck;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DeckFactory extends Factory
{
    protected $model = Deck::class;

    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(2);

        return [
            'title'      => $title,
            'slug'       => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1, 999999),
            'active'     => true,
            'chapter_id' => null,
        ];
    }

    /**
     * Rattache le deck à un chapitre donné.
     */
    public function forChapter(Chapter $chapter): static
    {
        return $this->state(fn (array $attributes): array => [
            'chapter_id' => $chapter->getKey(),
        ]);
    }

    /**
     * Deck désactivé (DeckController::index ne liste que les decks active).
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes): array => [
            'active' => false,
        ]);
    }

    /**
     * Crée des cartes rattachées au deck.
     */
    public function withCards(int $count = 2): static
    {
        return $this->afterCreating(function (Deck $deck) use ($count): void {
            \App\Models\Card::factory()->count($count)->forDeck($deck)->create();
        });
    }
}
