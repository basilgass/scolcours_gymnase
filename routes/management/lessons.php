<?php

use App\Http\Controllers\api\LessonApiController;
use App\Http\Controllers\web\LessonController;

Route::middleware('web')
     ->group(function () {

	     // Students routes
	     Route::middleware('students')
	          ->as('students.')
	          ->group(function () {

		          Route::get('cours/{course:slug}/leçon/{lesson}', [LessonController::class, 'show'])
		               ->name('lessons.show');

	          });

	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->prefix('admin')
	          ->group(function () {

		          Route::get('cours/{course:slug}/{team:name}/leçon/{lesson}', [LessonController::class, 'adminShow'])
		               ->name('courses.teams.lessons.show');

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

		          Route::apiResource('courses.lessons', LessonApiController::class)
		               ->shallow();

		          Route::patch('lesson_calendar/{team}/{lesson}/update', [LessonApiController::class, 'updateLessonCalendar'])
		               ->name('teams.lessons.calendars.update');

		          Route::patch('courses/{course}/lessons/order', [LessonApiController::class, 'updateLessonsOrder'])
		               ->name('courses.lessons.order');

		          Route::post('courses/{course}/lessons/posts', [LessonApiController::class, "storePosts"])
		               ->name('courses.lessons.posts.store');

	          });
     });
