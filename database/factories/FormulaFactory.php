<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\Formula;
use Illuminate\Database\Eloquent\Factories\Factory;

class FormulaFactory extends Factory
{
    protected $model = Formula::class;

    public function definition(): array
    {
        return [];
    }

    /**
     * Deux garanties après création :
     * - un block, sans quoi FormulaResource ($this->blocks[0]) planterait ;
     * - un rattachement à un chapitre (frais par défaut), la formule étant toujours
     *   consultée dans un contexte chapitre. L'état forChapter() remplace ce chapitre.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Formula $formula): void {
            $formula->blocks()->create(['body' => 'A modifier...']);

            if ($formula->chapters()->count() === 0) {
                $formula->chapters()->attach(Chapter::factory()->create(), ['order' => 1]);
            }
        });
    }

    /**
     * Rattache la formule à un chapitre précis (sync : remplace le chapitre auto de configure()).
     */
    public function forChapter(Chapter $chapter, int $order = 1): static
    {
        return $this->afterCreating(function (Formula $formula) use ($chapter, $order): void {
            $formula->chapters()->sync([$chapter->id => ['order' => $order]]);
        });
    }
}
