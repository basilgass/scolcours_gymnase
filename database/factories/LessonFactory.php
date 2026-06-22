<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Post;
use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition(): array
    {
        return [
            'course_id'       => Course::factory(),
            'lessonable_type' => Post::class,
            'lessonable_id'   => Post::factory(),
            'order'           => 1,
        ];
    }

    /**
     * Rattache la leçon à un cours donné.
     */
    public function forCourse(Course $course): static
    {
        return $this->state(fn (array $attributes): array => [
            'course_id' => $course->getKey(),
        ]);
    }

    /**
     * Fixe le modèle polymorphe pointé par la leçon (Post, Challenge, Deck…).
     */
    public function forLessonable(Model $lessonable): static
    {
        return $this->state(fn (array $attributes): array => [
            'lessonable_type' => $lessonable->getMorphClass(),
            'lessonable_id'   => $lessonable->getKey(),
        ]);
    }

    /**
     * Crée un calendrier (LessonCalendar) pour une équipe donnée après création.
     */
    public function withCalendar(Team $team): static
    {
        return $this->afterCreating(function (Lesson $lesson) use ($team): void {
            \App\Models\LessonCalendar::factory()
                ->forLesson($lesson)
                ->forTeam($team)
                ->create();
        });
    }
}
