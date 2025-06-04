<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;

Route::get('cours', [CourseController::class, 'index'])
	->name('courses.index');

Route::middleware(["auth", "verified"])
	->group(function(){
		// Course routes
		Route::get('cours/{course:slug}', [CourseController::class, 'show'])
			->name('courses.show');

		// Lesson routes
		Route::get('cours/{course:slug}/{lesson}', [LessonController::class, 'show'])
			->name('lessons.show');
	});
