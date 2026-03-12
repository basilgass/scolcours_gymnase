<?php

use App\Http\Controllers\api\QuizzApiController;
use App\Http\Controllers\QuizzSessionApiController;
use App\Http\Controllers\QuizzSessionController;

Route::middleware('web')
     ->group(function () {

	     // Students routes
	     Route::middleware('students')
		     ->as('students.')
	          ->group(function () {

		          Route::get('quizz', [QuizzSessionController::class, "index"])
		               ->name('quizzs.sessions.index');

		          Route::get('quizz/{quizzSession:shortcode}', [QuizzSessionController::class, "show"])
		               ->name('quizzs.sessions.show');

	          });

	     // Admin routes
	     Route::middleware('admin')
		     ->as('admin.')
		     ->prefix('admin')
		     ->group(function () {

		          Route::get('quizz/{quizzSession:shortcode}/dashboard', [QuizzSessionController::class, "dashboard"])
		               ->name('quizzs.sessions.dashboard');

		          Route::get('quizz/{quizzSession:shortcode}/projection', [QuizzSessionController::class, "projection"])
		               ->name('quizzs.sessions.projection');

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

			     Route::apiResource('quizzs.sessions', QuizzSessionApiController::class)
				     ->shallow();

		          Route::patch('quizz/{quizzSession}/updateCurrent', [QuizzApiController::class, "updateCurrent"])
		               ->name('quizzs.sessions.updateCurrent');

		          Route::patch('quizz/{quizzSession}/updateShowAnswer', [QuizzApiController::class, "updateShowAnswer"])
		               ->name('quizzs.sessions.updateShowAnswer');

		          Route::patch('quizz/{quizzSession}/updateEnable', [QuizzApiController::class, "updateEnable"])
		               ->name('quizzs.sessions.updateEnable');

	          });
     });
