<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Team;
use App\Models\Theme;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(2);

        return [
            'title'    => $title,
            'slug'     => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1, 999999),
            'theme_id' => Theme::factory(),
        ];
    }

    /**
     * Crée le block « par défaut » porté par le cours, comme le fait
     * CourseApiController::store. CourseResource lit toujours blocks[0],
     * donc tout cours réaliste possède au moins un block.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Course $course): void {
            $course->blocks()->create(['type' => 'text', 'body' => 'sans contenu']);
        });
    }

    /**
     * Rattache le cours à un thème donné.
     */
    public function forTheme(Theme $theme): static
    {
        return $this->state(fn (array $attributes): array => [
            'theme_id' => $theme->getKey(),
        ]);
    }

    /**
     * Crée des leçons (lessonable = Post) rattachées au cours.
     */
    public function withLessons(int $count = 2): static
    {
        return $this->afterCreating(function (Course $course) use ($count): void {
            \App\Models\Lesson::factory()
                ->count($count)
                ->forCourse($course)
                ->create();
        });
    }

    /**
     * Rattache une équipe au cours (pivot course_team).
     */
    public function withTeam(Team $team): static
    {
        return $this->afterCreating(function (Course $course) use ($team): void {
            $course->teams()->attach($team->getKey());
        });
    }
}
