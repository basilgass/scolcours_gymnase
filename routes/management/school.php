<?php

use App\Http\Controllers\TeamCalendarApiController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.


	     // Students routes
	     Route::middleware('students')
	          ->group(function () {

	          });

	     // Admin routes
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {

	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::get('school/timetable', [TeamCalendarApiController::class, 'timetable'])
	          ->name('school.timetable');
	     Route::get('school/calendar', [TeamCalendarApiController::class, 'school_calendar'])
	          ->name('school.calendar');

	     Route::get('teams/{team}/calendar', [TeamCalendarApiController::class, "index"])
	          ->name('teams.calendar');

	     // Students api
	     Route::middleware('students')
	          ->group(function () {
		          Route::get('teams/{team}/course/{course}/calendar', [TeamCalendarApiController::class, "course_calendar"])
		               ->name('teams.course.calendar');
	          });

	     // Admin api
	     Route::middleware('admin')
	          ->as('admin.')
	          ->prefix('admin')
	          ->group(function () {
		          Route::apiResource('teams.calendars', TeamCalendarApiController::class)
		               ->only(['store', 'update'])
		               ->shallow();

	          });

     });
