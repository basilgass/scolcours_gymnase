<?php

namespace Tests\Feature\Admin;

use App\Models\Calendars\SchoolCalendar;
use App\Models\SchoolTimetable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SchoolApiControllerTest extends TestCase
{
	use RefreshDatabase;

	public function test_admin_can_open_the_school_page(): void
	{
		$this->actingAsAdmin();
		SchoolTimetable::factory()->count(2)->create();
		SchoolCalendar::factory()->count(3)->create();

		$this->get(route('admin.school.index'))
			->assertStatus(200)
			->assertInertia(fn (Assert $page) => $page
				->component('Admin/AdminSchool')
				->has('timetables', 2)
				->has('calendars', 3));
	}

	public function test_admin_can_update_a_timetable_slot(): void
	{
		$this->actingAsAdmin();
		$slot = SchoolTimetable::factory()->create(['period' => 1, 'start' => '08:00:00', 'end' => '08:45:00']);

		$this->patchJson(route('api.admin.school.timetables.update', $slot), [
			'start' => '09:15',
			'end'   => '10:00',
		])->assertStatus(200)
			->assertJsonPath('start', '09:15')
			->assertJsonPath('end', '10:00');

		$fresh = $slot->fresh();
		$this->assertSame('09:15', $fresh->start->format('H:i'));
		$this->assertSame('10:00', $fresh->end->format('H:i'));
	}

	public function test_timetable_update_rejects_end_before_start(): void
	{
		$this->actingAsAdmin();
		$slot = SchoolTimetable::factory()->create();

		$this->patchJson(route('api.admin.school.timetables.update', $slot), [
			'start' => '10:00',
			'end'   => '09:00',
		])->assertStatus(422)->assertJsonValidationErrors(['end']);
	}

	public function test_admin_can_generate_the_calendar(): void
	{
		$this->actingAsAdmin();
		SchoolCalendar::factory()->create(['day' => '2020-01-01']);

		$this->postJson(route('api.admin.school.calendars.generate'), [
			'start'    => '2025-08-18',
			'end'      => '2025-08-29',
			'excluded' => ['2025-08-25'],
		])->assertStatus(200)
			->assertJsonCount(5); // seule la première semaine subsiste

		$this->assertFalse(SchoolCalendar::whereDate('day', '2020-01-01')->exists());
		$this->assertTrue(
			SchoolCalendar::whereDate('day', '2025-08-18')->where('week', 1)->where('school', true)->exists()
		);
	}

	public function test_generate_validates_its_input(): void
	{
		$this->actingAsAdmin();

		$this->postJson(route('api.admin.school.calendars.generate'), [
			'start' => '2025-08-29',
			'end'   => '2025-08-18',
		])->assertStatus(422)->assertJsonValidationErrors(['end']);
	}

	public function test_admin_can_toggle_a_calendar_day(): void
	{
		$this->actingAsAdmin();
		$day = SchoolCalendar::factory()->create(['school' => true]);

		$this->patchJson(route('api.admin.school.calendars.toggle', $day))
			->assertStatus(200)
			->assertJsonPath('school', false);

		$this->assertFalse($day->fresh()->school);

		$this->patchJson(route('api.admin.school.calendars.toggle', $day))
			->assertStatus(200)
			->assertJsonPath('school', true);
	}

	public function test_school_management_endpoints_require_admin(): void
	{
		$slot = SchoolTimetable::factory()->create();
		$day = SchoolCalendar::factory()->create();

		$this->patchJson(route('api.admin.school.timetables.update', $slot))->assertStatus(401);
		$this->postJson(route('api.admin.school.calendars.generate'))->assertStatus(401);
		$this->patchJson(route('api.admin.school.calendars.toggle', $day))->assertStatus(401);

		$this->actingAsUser();
		$this->patchJson(route('api.admin.school.timetables.update', $slot), ['start' => '08:00', 'end' => '09:00'])
			->assertForbidden();
		$this->postJson(route('api.admin.school.calendars.generate'), ['start' => '2025-08-18', 'end' => '2025-08-29'])
			->assertForbidden();
		$this->patchJson(route('api.admin.school.calendars.toggle', $day))->assertForbidden();
	}
}
