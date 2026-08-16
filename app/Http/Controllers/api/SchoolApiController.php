<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Calendars\SchoolCalendar;
use App\Models\SchoolTimetable;
use App\Services\School\SchoolCalendarGenerator;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Administration du calendrier scolaire et des créneaux horaires.
 *
 * Les lectures publiques restent dans TeamCalendarApiController ; ce contrôleur
 * regroupe les écritures réservées à l'administration.
 */
class SchoolApiController extends Controller
{
	/**
	 * Met à jour l'heure de début et de fin d'un créneau (édition simple).
	 */
	public function updateTimetable(Request $request, SchoolTimetable $timetable): SchoolTimetable
	{
		$validated = $request->validate([
			'start' => ['required', 'date_format:H:i'],
			'end'   => ['required', 'date_format:H:i', 'after:start'],
		]);

		$timetable->update($validated);

		return $timetable;
	}

	/**
	 * Régénère l'intégralité du calendrier scolaire pour une année.
	 *
	 * Opération destructive (truncate + régénération) : le front la protège par
	 * une confirmation explicite.
	 */
	public function generateCalendar(Request $request, SchoolCalendarGenerator $generator): Collection
	{
		$validated = $request->validate([
			'start'      => ['required', 'date'],
			'end'        => ['required', 'date', 'after:start'],
			'excluded'   => ['array'],
			'excluded.*' => ['date'],
		]);

		$generator->generate(
			Carbon::parse($validated['start']),
			Carbon::parse($validated['end']),
			$validated['excluded'] ?? [],
		);

		return SchoolCalendar::orderBy('day')->get();
	}

	/**
	 * Active ou désactive un jour d'école particulier.
	 */
	public function toggleCalendarDay(SchoolCalendar $calendar): SchoolCalendar
	{
		$calendar->update(['school' => !$calendar->school]);

		return $calendar;
	}
}
