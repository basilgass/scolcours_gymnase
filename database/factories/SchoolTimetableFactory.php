<?php

namespace Database\Factories;

use App\Models\SchoolTimetable;
use Illuminate\Database\Eloquent\Factories\Factory;

class SchoolTimetableFactory extends Factory
{
    protected $model = SchoolTimetable::class;

    public function definition(): array
    {
        return [
            'period' => $this->faker->numberBetween(1, 10),
            'start'  => '08:00:00',
            'end'    => '08:45:00',
        ];
    }
}
