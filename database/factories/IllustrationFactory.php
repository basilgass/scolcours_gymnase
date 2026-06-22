<?php

namespace Database\Factories;

use App\Models\Block;
use App\Models\Illustration;
use Illuminate\Database\Eloquent\Factories\Factory;

class IllustrationFactory extends Factory
{
    protected $model = Illustration::class;

    public function definition(): array
    {
        return [
            'block_id' => Block::factory(),
            'code'     => $this->faker->sentence(),
            'order'    => 1,
        ];
    }

    /**
     * Rattache l'illustration à un block donné.
     */
    public function forBlock(Block $block): static
    {
        return $this->state(fn (array $attributes): array => [
            'block_id' => $block->getKey(),
        ]);
    }
}
