<?php

namespace Database\Factories\Calendars;

use App\Models\Calendars\TeamCalendar;
use App\Models\SchoolTimetable;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeamCalendarFactory extends Factory
{
    protected $model = TeamCalendar::class;

    public function definition(): array
    {
        return [
            'team_id'             => Team::factory(),
            'day'                 => $this->faker->numberBetween(1, 5),
            'school_timetable_id' => SchoolTimetable::factory(),
        ];
    }

    /**
     * Rattache le créneau à une équipe donnée.
     */
    public function forTeam(Team $team): static
    {
        return $this->state(fn (array $attributes): array => [
            'team_id' => $team->getKey(),
        ]);
    }
}
