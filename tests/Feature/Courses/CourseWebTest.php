<?php

namespace Tests\Feature\Courses;

use App\Models\Course;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CourseWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_renders_empty_list_for_guests(): void
    {
        $this->get(route('courses.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/CourseIndex')
                ->where('teamCourses', []));
    }

    public function test_index_lists_courses_of_the_user_teams(): void
    {
        $user = $this->actingAsUser();
        $team = Team::factory()->create();
        $team->users()->attach($user);
        $course = Course::factory()->create();
        $course->teams()->attach($team);

        $this->get(route('courses.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/CourseIndex')
                ->has('teamCourses', 1)
                ->where('teamCourses.0.id', $course->id));
    }

    public function test_show_renders_course_for_a_team_member(): void
    {
        $user = $this->actingAsUser();
        $team = Team::factory()->create();
        $team->users()->attach($user);
        $course = Course::factory()->create();
        $course->teams()->attach($team);

        $this->get(route('students.courses.show', $course))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/CourseShow')
                ->where('course.id', $course->id));
    }

    public function test_show_forbids_a_user_not_in_any_course_team(): void
    {
        $this->actingAsUser();
        $course = Course::factory()->create();

        $this->get(route('students.courses.show', $course))
            ->assertForbidden();
    }

    public function test_show_redirects_admins_to_the_admin_index(): void
    {
        // Correction B5b : la condition utilisait $user->isAdmin (propriété
        // inexistante → toujours null) ; remplacée par $user->admin.
        $this->actingAsAdmin();
        $course = Course::factory()->create();

        $this->get(route('students.courses.show', $course))
            ->assertRedirect(route('admin.courses.index'));
    }

    public function test_show_requires_authentication(): void
    {
        $course = Course::factory()->create();

        $this->get(route('students.courses.show', $course))
            ->assertRedirect(route('login'));
    }

    public function test_edit_renders_for_admin(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();

        $this->get(route('admin.courses.edit', $course))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/CourseEdit')
                ->where('course.id', $course->id));
    }

    public function test_edit_is_restricted_to_admins(): void
    {
        $course = Course::factory()->create();

        $this->get(route('admin.courses.edit', $course))->assertRedirect();

        $this->actingAsUser();
        $this->get(route('admin.courses.edit', $course))->assertForbidden();
    }

    public function test_dashboard_renders_for_admin_with_an_explicit_team(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        $team = Team::factory()->create();
        $course->teams()->attach($team);

        $this->get(route('admin.courses.teams.dashboard', [$course, $team]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/admin/AdminCourseShow')
                ->where('course.id', $course->id));
    }

    public function test_show_team_renders_for_admin(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        $team = Team::factory()->create();
        $course->teams()->attach($team);

        $this->get(route('admin.courses.teams.show', [$course, $team]))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/CourseShow')
                ->where('course.id', $course->id));
    }
}
