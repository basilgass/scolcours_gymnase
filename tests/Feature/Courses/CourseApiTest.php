<?php

namespace Tests\Feature\Courses;

use App\Models\Course;
use App\Models\Theme;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_a_course_with_a_default_block(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();

        $response = $this->postJson(route('api.admin.courses.store'), [
            'title'    => 'Algèbre',
            'slug'     => 'algebre',
            'theme_id' => $theme->id,
        ])->assertStatus(201)
            ->assertJsonPath('title', 'Algèbre')
            ->assertJsonPath('slug', 'algebre');

        $course = Course::firstWhere('slug', 'algebre');
        $this->assertNotNull($course);
        // store() crée toujours un block ; CourseResource::blocks[0] en dépend.
        $this->assertSame(1, $course->blocks()->count());
    }

    public function test_store_requires_title_and_slug(): void
    {
        $this->actingAsAdmin();

        $this->postJson(route('api.admin.courses.store'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'slug']);
    }

    public function test_store_requires_admin(): void
    {
        $payload = ['title' => 'X', 'slug' => 'x'];

        $this->postJson(route('api.admin.courses.store'), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.courses.store'), $payload)->assertForbidden();
    }

    public function test_admin_can_update_a_course_and_its_block_body(): void
    {
        $this->actingAsAdmin();
        $theme = Theme::factory()->create();
        $course = Course::factory()->create();

        $this->patchJson(route('api.admin.courses.update', $course), [
            'theme_id' => $theme->id,
            'slug'     => 'nouveau-slug',
            'title'    => 'Nouveau titre',
            'body'     => 'Contenu mis à jour',
        ])->assertStatus(200)
            ->assertJsonPath('title', 'Nouveau titre');

        $course->refresh();
        $this->assertSame('nouveau-slug', $course->slug);
        $this->assertSame('Contenu mis à jour', $course->blocks[0]->body);
    }

    public function test_update_requires_an_existing_theme(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();

        $this->patchJson(route('api.admin.courses.update', $course), [
            'theme_id' => 999999,
            'slug'     => 's',
            'title'    => 't',
        ])->assertStatus(422)->assertJsonValidationErrors(['theme_id']);
    }

    public function test_update_requires_admin(): void
    {
        $course = Course::factory()->create();
        $payload = ['theme_id' => $course->theme_id, 'slug' => 's', 'title' => 't'];

        $this->patchJson(route('api.admin.courses.update', $course), $payload)->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.courses.update', $course), $payload)->assertForbidden();
    }

    public function test_admin_can_delete_a_course(): void
    {
        $this->actingAsAdmin();
        $course = Course::factory()->create();

        $this->deleteJson(route('api.admin.courses.destroy', $course))
            ->assertNoContent();

        $this->assertModelMissing($course);
    }

    public function test_destroy_requires_admin(): void
    {
        $course = Course::factory()->create();

        $this->deleteJson(route('api.admin.courses.destroy', $course))->assertStatus(401);

        $this->actingAsUser();
        $this->deleteJson(route('api.admin.courses.destroy', $course))->assertForbidden();
    }
}
