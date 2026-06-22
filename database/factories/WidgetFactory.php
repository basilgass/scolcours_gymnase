<?php

namespace Database\Factories;

use App\Models\Widget;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class WidgetFactory extends Factory
{
    protected $model = Widget::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->words(2, true);
        $slug = Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1, 999999);

        return [
            'name'        => $name,
            'slug'        => $slug,
            'component'   => $slug . '.vue',
            'theme_id'    => null,
            'description' => $this->faker->sentence(),
        ];
    }
}
