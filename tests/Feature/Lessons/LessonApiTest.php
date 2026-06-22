<?php

namespace Tests\Feature\Lessons;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LessonApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_lessons_of_a_course(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        $l1 = Lesson::factory()->forCourse($course)->create(['order' => 1]);
        $l2 = Lesson::factory()->forCourse($course)->create(['order' => 2]);

        $this->getJson(route('api.admin.courses.lessons.index', $course))
            ->assertStatus(200)
            ->assertJsonCount(2)
            ->assertJsonPath('0.id', $l1->id)
            ->assertJsonPath('1.id', $l2->id);
    }

    public function test_admin_can_show_a_lesson(): void
    {
        $this->actingAsAdmin();
        $lesson = Lesson::factory()->create();

        $this->getJson(route('api.admin.lessons.show', $lesson))
            ->assertStatus(200)
            ->assertJsonPath('id', $lesson->id)
            ->assertJsonPath('lessonable_type', 'Post');
    }

    public function test_admin_can_create_a_lesson_targeting_a_post(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        $post = Post::factory()->create();

        $this->postJson(route('api.admin.courses.lessons.store', $course), [
            'target_id'   => $post->id,
            'target_type' => 'post',
        ])->assertStatus(201)
            ->assertJsonPath('lessonable_id', $post->id)
            ->assertJsonPath('lessonable_type', 'Post');

        $this->assertSame(1, $course->lessons()->count());
        $this->assertSame(1, $course->lessons()->first()->order);
    }

    public function test_store_increments_order_from_existing_lessons(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();
        Lesson::factory()->forCourse($course)->create(['order' => 1]);
        $post = Post::factory()->create();

        $this->postJson(route('api.admin.courses.lessons.store', $course), [
            'target_id'   => $post->id,
            'target_type' => 'post',
        ])->assertStatus(201);

        // order = lessons existantes (1) + 1 = 2.
        $this->assertSame(2, $course->lessons()->where('lessonable_id', $post->id)->first()->order);
    }

    public function test_store_rejects_an_unknown_target_type(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();

        $this->postJson(route('api.admin.courses.lessons.store', $course), [
            'target_id'   => 1,
            'target_type' => 'banana',
        ])->assertStatus(422);
    }

    public function test_store_requires_admin(): void
    {
        $course = Course::factory()->create();
        $payload = ['target_id' => 1, 'target_type' => 'post'];

        $this->postJson(route('api.admin.courses.lessons.store', $course), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.courses.lessons.store', $course), $payload)
            ->assertForbidden();
    }

    public function test_admin_can_update_requires_and_score_rules(): void
    {
        $this->actingAsAdmin();
        $lesson = Lesson::factory()->create();

        $this->patchJson(route('api.admin.lessons.update', $lesson), [
            'requires'   => '1,2',
            'scoreRules' => ['min' => 10],
        ])->assertStatus(200);

        $lesson->refresh();
        $this->assertSame('1,2', $lesson->requires);
        $this->assertSame(['min' => 10], $lesson->scoreRules);
    }

    public function test_admin_can_delete_a_lesson(): void
    {
        $this->actingAsAdmin();
        $lesson = Lesson::factory()->create();

        $this->deleteJson(route('api.admin.lessons.destroy', $lesson))
            ->assertStatus(200);

        $this->assertModelMissing($lesson);
    }

    public function test_destroy_requires_admin(): void
    {
        $lesson = Lesson::factory()->create();

        $this->deleteJson(route('api.admin.lessons.destroy', $lesson))->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.lessons.destroy', $lesson))->assertForbidden();
    }
}
