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
        $slot = SchoolTimetable::factory()->create(['start' => '08:30:00']);
        TeamCalendar::factory()->forTeam($team)->create(['day' => 2, 'school_timetable_id' => $slot->id]);

        $this->getJson(route('api.teams.calendars.index', $team))
            ->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonPath('0.day', 2)
            ->assertJsonPath('0.school_timetable_id', $slot->id)
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
        $slot = SchoolTimetable::factory()->create(['start' => '10:15:00']);

        $this->postJson(route('api.admin.teams.calendars.store', $team), [
            'day'                 => 3,
            'school_timetable_id' => $slot->id,
        ])->assertStatus(201)
            ->assertJsonPath('day', 3)
            ->assertJsonPath('school_timetable_id', $slot->id)
            ->assertJsonPath('time', '10:15');

        $this->assertDatabaseHas('team_calendars', [
            'team_id'             => $team->id,
            'day'                 => 3,
            'school_timetable_id' => $slot->id,
        ]);
    }

    public function test_store_validates_day_range_and_timetable(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create();

        $this->postJson(route('api.admin.teams.calendars.store', $team), [
            'day'                 => 9,
            'school_timetable_id' => 999999,
        ])->assertStatus(422)->assertJsonValidationErrors(['day', 'school_timetable_id']);
    }

    public function test_store_requires_admin(): void
    {
        $team = Team::factory()->create();
        $slot = SchoolTimetable::factory()->create();
        $payload = ['day' => 1, 'school_timetable_id' => $slot->id];

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
        $slot = SchoolTimetable::factory()->create(['start' => '08:00:00']);
        $target = SchoolTimetable::factory()->create(['start' => '14:00:00']);
        $calendar = TeamCalendar::factory()->forTeam($team)->create(['day' => 1, 'school_timetable_id' => $slot->id]);

        $this->patchJson(route('api.admin.calendars.update', $calendar), [
            'day'                 => 4,
            'school_timetable_id' => $target->id,
        ])->assertStatus(200)
            ->assertJsonPath('day', 4)
            ->assertJsonPath('school_timetable_id', $target->id)
            ->assertJsonPath('time', '14:00');

        $this->assertSame(4, $calendar->fresh()->day);
    }

    public function test_update_requires_admin(): void
    {
        $slot = SchoolTimetable::factory()->create();
        $target = SchoolTimetable::factory()->create();
        $calendar = TeamCalendar::factory()->create(['day' => 1, 'school_timetable_id' => $slot->id]);
        $payload = ['day' => 2, 'school_timetable_id' => $target->id];

        $this->patchJson(route('api.admin.calendars.update', $calendar), $payload)
            ->assertStatus(401);

        $this->actingAsUser();
        $this->patchJson(route('api.admin.calendars.update', $calendar), $payload)
            ->assertForbidden();
    }

    public function test_admin_can_delete_a_team_calendar_slot(): void
    {
        $this->actingAsAdmin();
        $team = Team::factory()->create();
        $calendar = TeamCalendar::factory()->forTeam($team)->create(['day' => 1]);

        $this->deleteJson(route('api.admin.calendars.destroy', $calendar))
            ->assertStatus(204);

        $this->assertDatabaseMissing('team_calendars', ['id' => $calendar->id]);
    }

    public function test_deleting_a_timetable_slot_cascades_to_team_calendars(): void
    {
        $team = Team::factory()->create();
        $slot = SchoolTimetable::factory()->create();
        $calendar = TeamCalendar::factory()->forTeam($team)->create(['school_timetable_id' => $slot->id]);

        $slot->delete();

        $this->assertDatabaseMissing('team_calendars', ['id' => $calendar->id]);
    }
}
