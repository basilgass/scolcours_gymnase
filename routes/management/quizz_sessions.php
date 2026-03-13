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
		               ->name('quizzes.sessions.index');

		          Route::get('quizz/{quizzSession:shortcode}', [QuizzSessionController::class, "show"])
		               ->name('quizzes.sessions.show');

	          });

	     // Admin routes
	     Route::middleware('admin')
		     ->as('admin.')
		     ->prefix('admin')
		     ->group(function () {

		          Route::get('quizz/{quizzSession:shortcode}/dashboard', [QuizzSessionController::class, "dashboard"])
		               ->name('quizzes.sessions.dashboard');

		          Route::get('quizz/{quizzSession:shortcode}/projection', [QuizzSessionController::class, "projection"])
		               ->name('quizzes.sessions.projection');

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

			     Route::apiResource('quizzes.sessions', QuizzSessionApiController::class)
				     ->shallow()
				     ->parameters(['quizzes' => 'quizz']);

		          Route::patch('quizz/{quizzSession}/updateCurrent', [QuizzApiController::class, "updateCurrent"])
		               ->name('quizzes.sessions.current');

		          Route::patch('quizz/{quizzSession}/updateShowAnswer', [QuizzApiController::class, "updateShowAnswer"])
		               ->name('quizzes.sessions.answer');

		          Route::patch('quizz/{quizzSession}/updateEnable', [QuizzApiController::class, "updateEnable"])
		               ->name('quizzes.sessions.enable');

	          });
     });
