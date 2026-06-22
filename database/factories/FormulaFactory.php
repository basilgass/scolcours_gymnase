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
        return [
            'chapter_id' => Chapter::factory(),
            'order'      => 1,
        ];
    }

    /**
     * Une formule sans block ferait planter FormulaResource ($this->blocks[0]).
     * On reproduit le block créé par FormulaApiController::store.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Formula $formula): void {
            $formula->blocks()->create(['body' => 'A modifier...']);
        });
    }
}
