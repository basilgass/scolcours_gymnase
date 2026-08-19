<?php

namespace Tests\Feature\Admin;

use App\Models\Challenge;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Illustration;
use App\Models\Team;
use App\Models\Theme;
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

    public function test_challenges_are_ordered_by_theme_then_title_with_null_last(): void
    {
        // Thèmes créés dans l'ordre : le premier obtient le plus petit id (auto-increment).
        $themeLow = Theme::factory()->create();
        $themeHigh = Theme::factory()->create();

        $chapterLow = Chapter::factory()->create(['theme_id' => $themeLow->id]);
        $chapterHigh = Chapter::factory()->create(['theme_id' => $themeHigh->id]);

        // Ordre d'insertion volontairement mélangé pour que seul le tri du contrôleur puisse produire le résultat attendu.
        Challenge::factory()->create(['title' => 'Alpha', 'chapter_id' => $chapterHigh->id]);
        Challenge::factory()->create(['title' => 'Zulu', 'chapter_id' => $chapterLow->id]);
        Challenge::factory()->create(['title' => 'Alpha', 'chapter_id' => $chapterLow->id]);
        // Titre alphabétiquement premier mais sans thème : doit finir en dernier.
        Challenge::factory()->create(['title' => 'Aaa', 'chapter_id' => null]);

        $this->get(route('admin.challenges.index'))
            ->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Challenges/admin/AdminChallenge')
                ->has('challenges', 4)
                // Thème bas, départagé par titre (Alpha avant Zulu).
                ->where('challenges.0.title', 'Alpha')
                ->where('challenges.0.theme_id', $themeLow->id)
                ->where('challenges.1.title', 'Zulu')
                ->where('challenges.1.theme_id', $themeLow->id)
                // Thème haut ensuite.
                ->where('challenges.2.title', 'Alpha')
                ->where('challenges.2.theme_id', $themeHigh->id)
                // Sans thème en dernier, malgré un titre alphabétiquement premier.
                ->where('challenges.3.title', 'Aaa')
                ->where('challenges.3.theme_id', null));
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
