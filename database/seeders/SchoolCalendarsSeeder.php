<?php

namespace Database\Seeders;

use App\Models\Calendars\SchoolCalendar;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SchoolCalendarsSeeder extends Seeder
{
	public function run(): void
	{
		// TODO: Créer une interface pour le refaire de manière UI, plutôt qu'à la main (mais pas utile tout de suite :))
		SchoolCalendar::truncate();

		$start = Carbon::create(2025,8,18);
		$end = Carbon::create(2026, 6, 26);


		// Dates de début des semaines à exclure
		$excludedWeeks = [
			'2025-10-13',
			'2025-10-20',
			'2025-12-22',
			'2025-12-29',
			'2026-02-16',
			'2026-03-09',
			'2026-04-06',
			'2026-04-13',
		];


		// Génère toutes les dates à exclure
		$excludedDates = [];
		foreach ($excludedWeeks as $weekStart) {
			$date = Carbon::parse($weekStart);
			for ($i = 0; $i < 7; $i++) {
				$excludedDates[] = $date->toDateString();
				$date->addDay();
			}
		}

		$excludedDates = array_flip($excludedDates);


		$current = $start->copy();
		$weekNumber = 1;

		while ($current->lte($end)) {
			// Si le jour courant est un lundi et non exclu, on commence une nouvelle semaine
			if ($current->isMonday() && !isset($excludedDates[$current->toDateString()])) {

				// Parcourt la semaine
				for ($i = 0; $i < 7 && $current->lte($end); $i++) {
					if (
						!isset($excludedDates[$current->toDateString()]) &&
						!$current->isWeekend()
					) {
						SchoolCalendar::create([
							'week'   => $weekNumber,
							'day'    => $current->toDateString(),
							'school' => true,
						]);
					}
					$current->addDay();
				}
				$weekNumber++;
			} else {
				$current->addDay();
			}
		}
	}
}
