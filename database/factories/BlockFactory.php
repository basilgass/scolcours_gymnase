<?php

namespace Database\Factories;

use App\Models\Block;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

class BlockFactory extends Factory
{
    protected $model = Block::class;

    public function definition(): array
    {
        return [
            'blockable_type' => Post::class,
            'blockable_id'   => Post::factory(),
            'type'           => 'text',
            'body'           => $this->faker->paragraph(),
            'order'          => 1,
        ];
    }

    /**
     * Rattache le block à un hôte polymorphe donné (Post, Chapter, Question…).
     */
    public function forBlockable(Model $blockable): static
    {
        return $this->state(fn (array $attributes): array => [
            'blockable_type' => $blockable->getMorphClass(),
            'blockable_id'   => $blockable->getKey(),
        ]);
    }

    /**
     * Fixe le type du block (theorem, definition, property, text…).
     */
    public function ofType(string $type): static
    {
        return $this->state(fn (array $attributes): array => [
            'type' => $type,
        ]);
    }

    /**
     * Attache des illustrations au block après création.
     */
    public function withIllustrations(int $count = 1): static
    {
        return $this->afterCreating(function (Block $block) use ($count): void {
            \App\Models\Illustration::factory()->count($count)->create(['block_id' => $block->id]);
        });
    }
}