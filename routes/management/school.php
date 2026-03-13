<?php

use App\Http\Controllers\api\TeamCalendarApiController;

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
	          ->name('school.timetables.index');
	     Route::get('school/calendar', [TeamCalendarApiController::class, 'school_calendar'])
	          ->name('school.calendars.index');

	     Route::get('teams/{team}/calendar', [TeamCalendarApiController::class, "index"])
	          ->name('teams.calendars.index');

	     // Students api
	     Route::middleware('students')
	          ->group(function () {
		          Route::get('teams/{team}/course/{course}/calendar', [TeamCalendarApiController::class, "course_calendar"])
		               ->name('teams.courses.calendars.index');
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
