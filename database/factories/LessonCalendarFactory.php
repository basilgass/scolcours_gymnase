<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\LessonCalendar;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonCalendarFactory extends Factory
{
    protected $model = LessonCalendar::class;

    public function definition(): array
    {
        return [
            'team_id'      => Team::factory(),
            'lesson_id'    => Lesson::factory(),
            'scheduled_at' => now(),
            'homework'     => false,
        ];
    }

    /**
     * Rattache le calendrier à une leçon donnée.
     */
    public function forLesson(Lesson $lesson): static
    {
        return $this->state(fn (array $attributes): array => [
            'lesson_id' => $lesson->getKey(),
        ]);
    }

    /**
     * Rattache le calendrier à une équipe donnée.
     */
    public function forTeam(Team $team): static
    {
        return $this->state(fn (array $attributes): array => [
            'team_id' => $team->getKey(),
        ]);
    }
}
