<?php

use App\Http\Controllers\api\CourseApiController;
use App\Http\Controllers\api\LessonApiController;
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
	          ->prefix('admin')
	          ->group(function () {

		          Route::get('cours/{course:slug}/edit', [CourseController::class, 'edit'])
		               ->name('courses.edit');
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

		          Route::apiResource('courses.lessons', LessonApiController::class)
		               ->shallow();

		          Route::patch('lesson_calendar/{team}/{lesson}/update', [LessonApiController::class, 'updateLessonCalendar'])
		               ->name('teams.lessons.update');

				  Route::patch('courses/{course}/toggleTeam/{team}', [CourseApiController::class, 'toggleTeam'])
					  ->name('courses.toggle-team');
		          Route::patch('courses/{course}/lessons/order', [LessonApiController::class, 'updateLessonsOrder'])
		               ->name('courses.lessons.updateOrder');

		          Route::post('courses/{course}/lessons/posts', [LessonApiController::class, "storePosts"])
		               ->name('courses.lessons.posts.store');

		          Route::get('courses/lessonables', [CourseApiController::class, 'fetchLessonables'])
		               ->name('courses.lessonables');

				  Route::get('course/{course}/team/{team}/stats', [CourseApiController::class, 'teamStats'])
					  ->name('courses.teams.stats');
	          });

     });
