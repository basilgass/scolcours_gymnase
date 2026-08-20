<?php

namespace Database\Factories;

use App\Models\Generator;
use Illuminate\Database\Eloquent\Factories\Factory;

class GeneratorFactory extends Factory
{
    protected $model = Generator::class;

    public function definition(): array
    {
        return [
            'theme_id' => 1,
            'slug' => $this->faker->unique()->slug(),
            'title' => $this->faker->sentence(3),
            'body' => $this->faker->text(),
            'template' => null,
            'keyboard' => '',
            'code' => $this->faker->text(),
            'parameters_schema' => null,
            'active' => true,
        ];
    }
}
