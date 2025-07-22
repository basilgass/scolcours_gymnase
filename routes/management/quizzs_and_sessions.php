<?php

use App\Http\Controllers\api\QuizzApiController;
use App\Http\Controllers\web\QuizzController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     // Quizz homepage - this is where the user will see their available quizz.
	     Route::get('q', function (){return redirect()->route('quizzs.index');});

	     Route::get('quizz', [QuizzController::class, "index"])
	          ->name('quizzs.index');


	     // Students routes
	     Route::middleware('students')
		     ->prefix('students')
		     ->as('students.')
	          ->group(function () {
		          // Quizz session for user
		          Route::get('quizz/{quizzSession:shortcode}', [QuizzController::class, "show"])
		               ->name('quizzs.sessions.show');

	          });

	     // Admin routes
	     Route::middleware('admin')
		     ->as('admin.')
		     ->prefix('admin')
		     ->group(function () {


		          // Main  page, to list all quizz.
		          Route::get('quizz', [QuizzController::class, "admin"])
		               ->name('quizzs.index');

		          // One quizz admin page, with the list of sessions
		          Route::get('quizz/{quizz}', [QuizzController::class, "adminQuizz"])
		               ->name('quizzs.quizz');

		          // Quizz session for admin
		          Route::get('quizz/{quizzSession:shortcode}/dashboard', [QuizzController::class, "dashboard"])
		               ->name('quizzs.sessions.dashboard');
		          // Quizz session for projection
		          Route::get('quizz/{quizzSession:shortcode}/projection', [QuizzController::class, "projection"])
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

		          Route::apiResource('quizzs', QuizzApiController::class);


		          Route::post('quizz/{quizz}/sessions/create', [QuizzApiController::class, "sessionCreate"])
		               ->name("quizzs.sessions.create");
		          Route::delete('quizz/sessions/{quizzSession}/destroy', [QuizzApiController::class, "sessionDestroy"])
		               ->name("quizzs.sessions.destroy");

		          Route::post('quizz/{quizzSession:shortcode}/updateCurrent', [QuizzApiController::class, "updateCurrent"])
		               ->name('quizzs.sessions.updateCurrent');
		          Route::post('quizz/{quizzSession:shortcode}/updateEnable', [QuizzApiController::class, "updateEnable"])
		               ->name('quizzs.sessions.updateEnable');

	          });

     });
