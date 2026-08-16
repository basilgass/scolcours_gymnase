<?php

namespace Tests\Feature\Calendars;

use App\Models\Calendars\SchoolCalendar;
use App\Services\School\SchoolCalendarGenerator;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SchoolCalendarGeneratorTest extends TestCase
{
	use RefreshDatabase;

	private function generate(string $start, string $end, array $excluded = []): void
	{
		(new SchoolCalendarGenerator())->generate(
			Carbon::parse($start),
			Carbon::parse($end),
			$excluded,
		);
	}

	public function test_it_creates_only_weekdays(): void
	{
		// Deux semaines complètes à partir d'un lundi.
		$this->generate('2025-08-18', '2025-08-29');

		$this->assertSame(10, SchoolCalendar::count());
		// Aucun week-end.
		$this->assertFalse(SchoolCalendar::whereDate('day', '2025-08-23')->exists()); // samedi
		$this->assertFalse(SchoolCalendar::whereDate('day', '2025-08-24')->exists()); // dimanche
	}

	public function test_week_numbers_are_consecutive_across_weeks(): void
	{
		$this->generate('2025-08-18', '2025-08-29');

		$this->assertSame(1, SchoolCalendar::whereDate('day', '2025-08-18')->value('week'));
		$this->assertSame(2, SchoolCalendar::whereDate('day', '2025-08-25')->value('week'));
	}

	public function test_excluded_week_creates_no_row_and_consumes_no_week_number(): void
	{
		// La première semaine (18 août) est exclue : aucune ligne, et le numéro
		// de semaine ne saute pas — la semaine suivante devient la semaine 1.
		$this->generate('2025-08-18', '2025-08-29', ['2025-08-18']);

		$this->assertFalse(SchoolCalendar::whereDate('day', '2025-08-18')->exists());
		$this->assertSame(5, SchoolCalendar::count());
		$this->assertSame(1, SchoolCalendar::whereDate('day', '2025-08-25')->value('week'));
	}

	public function test_it_truncates_previous_calendar(): void
	{
		SchoolCalendar::factory()->create(['day' => '2020-01-01']);

		$this->generate('2025-08-18', '2025-08-22');

		$this->assertFalse(SchoolCalendar::whereDate('day', '2020-01-01')->exists());
	}
}
