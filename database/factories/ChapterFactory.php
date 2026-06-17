<?php

namespace Database\Factories;

use App\Models\Chapter;
use App\Models\Theme;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChapterFactory extends Factory
{
	/**
	 * The name of the factory's corresponding model.
	 *
	 * @var string
	 */
	protected $model = Chapter::class;

	/**
	 * Define the model's default state.
	 *
	 * @return array
	 */
	public function definition()
	{
		return [
			'theme_id' => Theme::factory(),
			'slug' => $this->faker->unique()->slug(),
			'title' => $this->faker->sentence(),
			'active' => true,
		];
	}

}
