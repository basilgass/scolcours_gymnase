<?php

namespace Tests\Feature\Calendars;

use App\Models\Calendars\SchoolCalendar;
use App\Models\Calendars\TeamCalendar;
use App\Models\Course;
use App\Models\SchoolTimetable;
use App\Models\Team;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalendarApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_school_timetable_is_public(): void
    {
        SchoolTimetable::factory()->count(3)->create();

        $this->getJson(route('api.school.timetables.index'))
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_school_calendar_is_public(): void
    {
        SchoolCalendar::factory()->count(2)->create();

        $this->getJson(route('api.school.calendars.index'))
            ->assertStatus(200)
            ->assertJsonCount(2);
    }

    public function test_team_calendar_index_is_public_and_formats_time(): void
    {
        $team = Team::factory()->create();
        TeamCalendar::factory()->forTeam($team)->create(['day' => 2, 'time' => '08:30:00']);

        $this->getJson(route('api.teams.calendars.index', $team))
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.day', 2)
            ->assertJsonPath('0.time', '08:30');
    }

    public function test_course_calendar_requires_authentication(): void
    {
        $team = Team::factory()->create();
        $course = Course::factory()->create();

        $this->getJson(route('api.teams.courses.calendars.index', [$team, $course]))
            ->assertStatus(401);
    }

    public function test_course_calendar_is_available_to_verified_users(): void
    {
        $this->actingAsUser();
        $team = Team::factory()->create();
        $course = Course::factory()->create();

        $this->getJson(route('api.teams.courses.calendars.index', [$team, $course]))
            ->assertStatus(200)
            ->assertJsonPath('id', $course->id);
    }

    public function test_admin_can_store_a_team_calendar_slot(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create();

        $this->postJson(route('api.admin.teams.calendars.store', $team), [
            'day'  => 3,
            'time' => '10:15:00',
        ])->assertStatus(201)
            ->assertJsonPath('day', 3)
            ->assertJsonPath('time', '10:15');

        $this->assertDatabaseHas('team_calendars', [
            'team_id' => $team->id,
            'day'     => 3,
        ]);
    }

    public function test_store_validates_day_range_and_time(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create();

        $this->postJson(route('api.admin.teams.calendars.store', $team), [
            'day'  => 9,
            'time' => 'not-a-time',
        ])->assertStatus(422)->assertJsonValidationErrors(['day', 'time']);
    }

    public function test_store_requires_admin(): void
    {
        $team = Team::factory()->create();
        $payload = ['day' => 1, 'time' => '08:00:00'];

        $this->postJson(route('api.admin.teams.calendars.store', $team), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->postJson(route('api.admin.teams.calendars.store', $team), $payload)
            ->assertForbidden();
    }

    public function test_admin_can_update_a_team_calendar_slot_via_shallow_route(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create();
        $calendar = TeamCalendar::factory()->forTeam($team)->create(['day' => 1, 'time' => '08:00:00']);

        $this->patchJson(route('api.admin.calendars.update', $calendar), [
            'day'  => 4,
            'time' => '14:00:00',
        ])->assertStatus(200)
            ->assertJsonPath('day', 4)
            ->assertJsonPath('time', '14:00');

        $this->assertSame(4, $calendar->fresh()->day);
    }

    public function test_update_requires_admin(): void
    {
        $calendar = TeamCalendar::factory()->create(['day' => 1, 'time' => '08:00:00']);
        $payload = ['day' => 2, 'time' => '09:00:00'];

        $this->patchJson(route('api.admin.calendars.update', $calendar), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.calendars.update', $calendar), $payload)
            ->assertForbidden();
    }
}
