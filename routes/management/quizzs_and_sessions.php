<?php

use App\Http\Controllers\api\QuizzApiController;
use App\Http\Controllers\QuizzSessionApiController;
use App\Http\Controllers\QuizzSessionController;
use App\Http\Controllers\web\QuizzController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     // Quizz homepage - this is where the user will see their available quizz.
//	     Route::get('q', function (){return redirect()->route('quizzs.index');});

//	     Route::get('quizz', [QuizzController::class, "index"])
//	          ->name('quizzs.index');


	     // Students routes
	     Route::middleware('students')
		     ->as('students.')
	          ->group(function () {
		          Route::get('quizz', [QuizzSessionController::class, "index"])
		               ->name('quizzs.sessions.index');

		          // Quizz session for user
		          Route::get('quizz/{quizzSession:shortcode}', [QuizzSessionController::class, "show"])
		               ->name('quizzs.sessions.show');

	          });

	     // Admin routes
	     Route::middleware('admin')
		     ->as('admin.')
		     ->prefix('admin')
		     ->group(function () {

				 Route::resource('quizzs', QuizzController::class)
					 ->only('index', 'edit');

		          // Quizz session for admin
		          Route::get('quizz/{quizzSession:shortcode}/dashboard', [QuizzSessionController::class, "dashboard"])
		               ->name('quizzs.sessions.dashboard');

		          // Quizz session for projection
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

		          Route::apiResource('quizzs', QuizzApiController::class)
		          ->only(['store', 'update', 'destroy']);

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
