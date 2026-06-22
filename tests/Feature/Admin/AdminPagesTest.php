<?php

namespace Tests\Feature\Admin;

use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Illustration;
use App\Models\Team;
use App\Models\Tool;
use App\Models\Widget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAsAdmin();
    }

    public function test_dashboard_page(): void
    {
        Team::factory()->create(['active' => true]);

        $this->get(route('admin.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/AdminDashboard')
                ->has('courses')
                ->has('teams'));
    }

    public function test_chapters_page(): void
    {
        Chapter::factory()->create();

        $this->get(route('admin.chapters.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Chapters/admin/AdminChapter')
                ->has('chapters', 1));
    }

    public function test_challenges_page(): void
    {
        Challenge::factory()->create();

        $this->get(route('admin.challenges.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Challenges/admin/AdminChallenge')
                ->has('challenges', 1));
    }

    public function test_illustrations_page(): void
    {
        Illustration::factory()->create();

        $this->get(route('admin.illustrations.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Illustrations/admin/AdminIllustration')
                ->has('illustrations', 1));
    }

    public function test_courses_page(): void
    {
        Course::factory()->create();

        $this->get(route('admin.courses.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/admin/AdminCourse')
                ->has('courses', 1)
                ->has('teams'));
    }

    public function test_agenda_page(): void
    {
        Course::factory()->create();

        $this->get(route('admin.agenda'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Courses/admin/AdminAgenda')
                ->has('courses', 1));
    }

    public function test_tools_page(): void
    {
        Storage::fake('tools');
        Tool::factory()->create();

        $this->get(route('admin.tools.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tools/admin/AdminTool')
                ->has('tools', 1));
    }

    public function test_widgets_page(): void
    {
        Storage::fake('widgets');
        Widget::factory()->create();

        $this->get(route('admin.widgets.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/AdminWidget')
                ->has('widgets', 1));
    }
}
