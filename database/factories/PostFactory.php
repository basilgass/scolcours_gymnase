<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        return [
            'chapter_id' => Chapter::factory(),
            'title'      => $this->faker->sentence(3),
            'order'      => 1,
        ];
    }

    /**
     * Rattache le post à un chapitre donné.
     */
    public function forChapter(Chapter $chapter): static
    {
        return $this->state(fn (array $attributes): array => [
            'chapter_id' => $chapter->getKey(),
        ]);
    }

    /**
     * Post inactif (masqué aux non-admins).
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes): array => [
            'active' => false,
        ]);
    }

    /**
     * Crée un block « par défaut » porté par le post, comme le fait le frontend.
     * Sans cet état, le post est volontairement sans block.
     */
    public function withBlock(): static
    {
        return $this->afterCreating(function (Post $post): void {
            $post->blocks()->create(['type' => 'text', 'body' => 'sans contenu']);
        });
    }
}