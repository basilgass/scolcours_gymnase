<?php

namespace Database\Factories;

use App\Models\Theme;
use Illuminate\Database\Eloquent\Factories\Factory;

class ThemeFactory extends Factory
{
    protected $model = Theme::class;

    public function definition(): array
    {
        return [
            'slug'    => $this->faker->unique()->slug(),
            'title'   => $this->faker->sentence(2),
            'order'   => 1,
            'color'   => 'scolcours-main',
            'icon'    => null,
            'enabled' => true,
        ];
    }
}
