<?php

namespace Database\Factories;

use App\Models\Exercise;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExerciseFactory extends Factory
{
	/**
	 * The name of the factory's corresponding model.
	 *
	 * @var string
	 */
	protected $model = Exercise::class;

	/**
	 * Define the model's default state.
	 *
	 * @return array
	 */
	public function definition()
	{
		return [
			'chapter_id' => 1,
			'title' => $this->faker->sentence(),
			'body' => $this->faker->text(),
			'answer' => $this->faker->word(),
			'explanation' => $this->faker->text()
		];
	}

}
