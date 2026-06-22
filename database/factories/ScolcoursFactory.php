<?php

namespace Database\Factories;

use App\Models\Scolcours;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScolcoursFactory extends Factory
{
    protected $model = Scolcours::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
        ];
    }
}
