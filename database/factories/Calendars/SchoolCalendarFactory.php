<?php

namespace Database\Factories\Calendars;

use App\Models\Calendars\SchoolCalendar;
use Illuminate\Database\Eloquent\Factories\Factory;

class SchoolCalendarFactory extends Factory
{
    protected $model = SchoolCalendar::class;

    public function definition(): array
    {
        return [
            'week'   => $this->faker->numberBetween(1, 52),
            'day'    => $this->faker->date(),
            'school' => true,
        ];
    }
}
