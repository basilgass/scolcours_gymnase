<?php

namespace App\Services\School;

use App\Models\Calendars\SchoolCalendar;
use Carbon\Carbon;

/**
 * Génère le calendrier scolaire (jours d'école) à partir d'une plage de dates
 * et d'une liste de semaines à exclure.
 *
 * Source unique de l'algorithme, partagée par le seeder et l'API d'administration :
 * seuls les jours ouvrés non exclus reçoivent une ligne (`school = true`), et le
 * numéro de semaine `week` est incrémenté sans trou (les semaines exclues n'en
 * consomment pas). `CourseAgenda.vue` s'appuie sur ces deux invariants.
 */
class SchoolCalendarGenerator
{
	/**
	 * Vide la table puis régénère le calendrier pour la plage donnée.
	 *
	 * @param Carbon        $start           Premier jour de la plage (typiquement un lundi de rentrée).
	 * @param Carbon        $end             Dernier jour de la plage.
	 * @param list<string>  $excludedMondays Dates (Y-m-d) des lundis dont la semaine est exclue.
	 */
	public function generate(Carbon $start, Carbon $end, array $excludedMondays = []): void
	{
		SchoolCalendar::truncate();

		$excludedDates = $this->expandExcludedWeeks($excludedMondays);

		$current = $start->copy();
		$weekNumber = 1;

		while ($current->lte($end)) {
			// On démarre une semaine uniquement sur un lundi non exclu.
			if ($current->isMonday() && !isset($excludedDates[$current->toDateString()])) {
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

	/**
	 * Développe chaque lundi exclu en ses 7 jours, pour un test d'appartenance en O(1).
	 *
	 * @param  list<string>       $excludedMondays
	 * @return array<string, int> Ensemble de dates (Y-m-d) exclues, sous forme de clés.
	 */
	private function expandExcludedWeeks(array $excludedMondays): array
	{
		$excludedDates = [];

		foreach ($excludedMondays as $weekStart) {
			$date = Carbon::parse($weekStart);
			for ($i = 0; $i < 7; $i++) {
				$excludedDates[] = $date->toDateString();
				$date->addDay();
			}
		}

		return array_flip($excludedDates);
	}
}
