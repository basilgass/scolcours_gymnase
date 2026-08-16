<?php

namespace Tests\Feature\Lessons;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Post;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LessonApiActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_store_several_post_lessons_at_once(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        $posts = Post::factory()->count(3)->create();

        $this->postJson(route('api.admin.courses.lessons.posts.store', $course), [
            'ids' => $posts->pluck('id')->all(),
        ])->assertStatus(200)
            ->assertJsonCount(3);

        $this->assertSame(3, $course->lessons()->count());
    }

    public function test_store_posts_requires_an_ids_array(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();

        $this->postJson(route('api.admin.courses.lessons.posts.store', $course), [])
            ->assertStatus(422)->assertJsonValidationErrors(['ids']);
    }

    public function test_store_posts_requires_admin(): void
    {
        $course = Course::factory()->create();

        $this->postJson(route('api.admin.courses.lessons.posts.store', $course), ['ids' => [1]])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.courses.lessons.posts.store', $course), ['ids' => [1]])
            ->assertForbidden();
    }

    public function test_admin_can_reorder_lessons(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        $l1 = Lesson::factory()->forCourse($course)->create(['order' => 1]);
        $l2 = Lesson::factory()->forCourse($course)->create(['order' => 2]);

        $this->patchJson(route('api.admin.courses.lessons.order', $course), [
            'order' => [
                ['id' => $l1->id, 'order' => 2],
                ['id' => $l2->id, 'order' => 1],
            ],
        ])->assertStatus(200);

        $this->assertSame(2, $l1->fresh()->order);
        $this->assertSame(1, $l2->fresh()->order);
    }

    public function test_reorder_requires_admin(): void
    {
        $course = Course::factory()->create();

        $this->patchJson(route('api.admin.courses.lessons.order', $course), ['order' => []])
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.courses.lessons.order', $course), ['order' => []])
            ->assertForbidden();
    }

    public function test_admin_can_create_or_update_a_lesson_calendar(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        $lesson = Lesson::factory()->forCourse($course)->create();
        $team = Team::factory()->create();

        // Création → modèle fraîchement créé → 201.
        $this->patchJson(route('api.admin.teams.lessons.calendars.update', [$team, $lesson]), [
            'scheduled_at' => '2026-09-01T23:59',
            'homework'     => true,
            'deadline'     => true,
        ])->assertStatus(201);

        $this->assertDatabaseHas('lesson_calendars', [
            'lesson_id' => $lesson->id,
            'team_id'   => $team->id,
            'homework'  => true,
            'deadline'  => true,
        ]);

        // Second appel sur le même couple (team, lesson) : updateOrCreate met à jour → 200.
        // deadline explicitement remis à false → l'échéance est bien effacée.
        $this->patchJson(route('api.admin.teams.lessons.calendars.update', [$team, $lesson]), [
            'scheduled_at' => '2026-09-08T10:00',
            'homework'     => false,
            'deadline'     => false,
        ])->assertStatus(200);

        $this->assertDatabaseHas('lesson_calendars', [
            'lesson_id' => $lesson->id,
            'team_id'   => $team->id,
            'deadline'  => false,
        ]);

        $this->assertSame(1, $lesson->calendars()->count());
    }

    public function test_update_lesson_calendar_validates_payload(): void
    {
        $this->actingAsAdmin();
        $lesson = Lesson::factory()->create();
        $team = Team::factory()->create();

        $this->patchJson(route('api.admin.teams.lessons.calendars.update', [$team, $lesson]), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['scheduled_at', 'homework']);
    }

    public function test_update_lesson_calendar_requires_admin(): void
    {
        $lesson = Lesson::factory()->create();
        $team = Team::factory()->create();
        $payload = ['scheduled_at' => '2026-09-01T08:30', 'homework' => true];

        $this->patchJson(route('api.admin.teams.lessons.calendars.update', [$team, $lesson]), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.teams.lessons.calendars.update', [$team, $lesson]), $payload)
            ->assertForbidden();
    }
}
