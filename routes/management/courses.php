<?php

use App\Http\Controllers\api\CourseApiController;
use App\Http\Controllers\web\CourseController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::get('cours', [CourseController::class, 'index'])
	          ->name('courses.index');

	     // Students routes
	     Route::middleware('students')
	          ->as('students.')
	          ->group(function () {

		          Route::get('cours/{course:slug}', [CourseController::class, 'show'])
		               ->name('courses.show');

	          });

	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->prefix('admin')
	          ->group(function () {

		          Route::get('cours/{course:slug}/edit', [CourseController::class, 'edit'])
		               ->name('courses.edit');
		          Route::get('cours/{course:slug}/{team:name}/dashboard', [CourseController::class, 'dashboard'])
		               ->name('courses.dashboard');
		          Route::get('cours/{course:slug}/{team:name}', [CourseController::class, 'showTeam'])
		               ->name('courses.show-team');

	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {

	     // Admin api
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {

		          Route::apiResource('courses', CourseApiController::class);

		          Route::patch('courses/{course}/toggleTeam/{team}', [CourseApiController::class, 'toggleTeam'])
		               ->name('courses.toggle-team');

		          Route::get('courses/lessonables', [CourseApiController::class, 'fetchLessonables'])
		               ->name('courses.lessonables');

		          Route::get('course/{course}/team/{team}/stats', [CourseApiController::class, 'teamStats'])
		               ->name('courses.teams.stats');

	          });
     });
