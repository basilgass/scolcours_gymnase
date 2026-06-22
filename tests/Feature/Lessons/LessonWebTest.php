<?php

namespace Tests\Feature\Lessons;

use App\Models\Chapter;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Post;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LessonWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_show_renders_the_lesson_for_an_authenticated_user(): void
    {
        $this->actingAsUser();
        $course = Course::factory()->create();
        $post = Post::factory()->withBlock()->create();
        $lesson = Lesson::factory()->forCourse($course)->forLessonable($post)->create();

        $this->get(route('students.lessons.show', [$course, $lesson]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/LessonShow')
                ->where('lesson.id', $lesson->id)
                ->where('course.id', $course->id)
                ->has('lessonable'));
    }

    public function test_show_resolves_null_resource_for_an_unmapped_lessonable(): void
    {
        // resolveLessonableResource ne mappe que Post/Challenge/Generator/Deck.
        // Un Chapter (non mappé mais doté d'un titre) → resource null.
        $this->actingAsUser();
        $course = Course::factory()->create();
        $chapter = Chapter::factory()->create();
        $lesson = Lesson::factory()->forCourse($course)->forLessonable($chapter)->create();

        $this->get(route('students.lessons.show', [$course, $lesson]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/LessonShow')
                ->where('lessonable', null));
    }

    public function test_show_requires_authentication(): void
    {
        $course = Course::factory()->create();
        $post = Post::factory()->withBlock()->create();
        $lesson = Lesson::factory()->forCourse($course)->forLessonable($post)->create();

        $this->get(route('students.lessons.show', [$course, $lesson]))
            ->assertRedirect(route('login'));
    }

    public function test_admin_show_renders_for_admin(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        // {team:name} est scopé sur $course->teams() (scoped implicit binding) :
        // l'équipe doit être attachée au cours pour que le binding aboutisse.
        $team = Team::factory()->create(['name' => 'classe-a']);
        $course->teams()->attach($team);
        $post = Post::factory()->withBlock()->create();
        $lesson = Lesson::factory()->forCourse($course)->forLessonable($post)->create();

        $this->get(route('admin.courses.teams.lessons.show', [$course, $team, $lesson]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/LessonShow')
                ->where('lesson.id', $lesson->id)
                ->where('team.id', $team->id));
    }

    public function test_admin_show_is_restricted_to_admins(): void
    {
        $course = Course::factory()->create();
        $team = Team::factory()->create(['name' => 'classe-b']);
        $course->teams()->attach($team);
        $lesson = Lesson::factory()->forCourse($course)->create();

        $this->get(route('admin.courses.teams.lessons.show', [$course, $team, $lesson]))
            ->assertRedirect();

        $this->actingAsUser();
        $this->get(route('admin.courses.teams.lessons.show', [$course, $team, $lesson]))
            ->assertForbidden();
    }
}
