<?php

namespace Database\Seeders;

use App\Services\School\SchoolCalendarGenerator;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SchoolCalendarsSeeder extends Seeder
{
	public function __construct(private readonly SchoolCalendarGenerator $generator) { }

	public function run(): void
	{
		$this->generator->generate(
			Carbon::create(2025, 8, 18),
			Carbon::create(2026, 6, 26),
			[
				'2025-10-13',
				'2025-10-20',
				'2025-12-22',
				'2025-12-29',
				'2026-02-16',
				'2026-03-09',
				'2026-04-06',
				'2026-04-13',
			],
		);
	}
}
