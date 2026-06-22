<?php

namespace Database\Factories;

use App\Models\Tool;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ToolFactory extends Factory
{
    protected $model = Tool::class;

    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(2);

        return [
            'title'      => $title,
            'slug'       => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1, 999999),
            'body'       => $this->faker->paragraph(),
            'parameters' => '',
            'theme_id'   => null,
        ];
    }
}
