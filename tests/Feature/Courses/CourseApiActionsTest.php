<?php

namespace Tests\Feature\Courses;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Score;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseApiActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_attach_and_detach_a_team(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        $team = Team::factory()->create();

        // Premier appel : attache → renvoie true (casté en "1").
        $this->patchJson(route('api.admin.courses.teams.toggle', [$course, $team]))
            ->assertStatus(200)
            ->assertContent('1');
        $this->assertTrue($course->teams()->where('teams.id', $team->id)->exists());

        // Second appel : détache → renvoie false (casté en chaîne vide).
        $this->patchJson(route('api.admin.courses.teams.toggle', [$course, $team]))
            ->assertStatus(200)
            ->assertContent('');
        $this->assertFalse($course->teams()->where('teams.id', $team->id)->exists());
    }

    public function test_toggle_team_requires_admin(): void
    {
        $course = Course::factory()->create();
        $team = Team::factory()->create();

        $this->patchJson(route('api.admin.courses.teams.toggle', [$course, $team]))
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.courses.teams.toggle', [$course, $team]))
            ->assertForbidden();
    }

    public function test_team_stats_aggregates_resolved_scores_per_lesson(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        $lesson = Lesson::factory()->forCourse($course)->create();

        $team = Team::factory()->create();
        $user = User::factory()->create();
        $team->users()->attach($user);

        Score::factory()
            ->forUser($user)
            ->forScoreable($lesson)
            ->create(['is_resolved' => true]);

        $this->getJson(route('api.admin.courses.teams.stats', [$course, $team]))
            ->assertStatus(200)
            ->assertJsonPath($lesson->id . '.lesson_id', $lesson->id)
            ->assertJsonPath($lesson->id . '.total_scores', 1)
            ->assertJsonPath($lesson->id . '.resolved_scores', 1);
    }

    public function test_team_stats_requires_admin(): void
    {
        $course = Course::factory()->create();
        $team = Team::factory()->create();

        $this->getJson(route('api.admin.courses.teams.stats', [$course, $team]))
            ->assertStatus(401);

        $this->actingAsUser();
        $this->getJson(route('api.admin.courses.teams.stats', [$course, $team]))
            ->assertForbidden();
    }
}
