<?php

use App\Http\Controllers\api\CourseApiController;
use App\Http\Controllers\LessonApiController;
use App\Http\Controllers\web\CourseController;
use App\Http\Controllers\web\LessonController;

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

		          // Lesson routes
		          Route::get('cours/{course:slug}/leçon/{lesson}', [LessonController::class, 'show'])
		               ->name('lessons.show');

	          });



	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->group(function () {

		          Route::get('cours/{course:slug}/edit', [CourseController::class, 'edit'])
		               ->name('courses.edit');

	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {

	     // Students api
	     Route::middleware('students')
	          ->prefix('students')
	          ->as('students.')
	          ->group(function () {

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::apiResource('courses', CourseApiController::class);

		          Route::apiResource('courses.lessons', LessonApiController::class)
		               ->shallow();

		          Route::get('courses/lessonables', [CourseApiController::class, 'fetchLessonables'])
		               ->name('courses.lessonables');
	          });

     });
