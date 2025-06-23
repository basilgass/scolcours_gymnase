<?php

use App\Http\Controllers\api\ScoreApiController;

//Route::middleware('web')
//     ->group(function () {
//	     // Public routes.
//
//	     // Students routes
//	     Route::middleware('students')
//	          ->prefix('students')
//	          ->as('students.')
//	          ->group(function () {
//
//	          });
//
//	     // Admin routes
//	     Route::middleware('admin')
//	          ->prefix('admin')
//	          ->as('admin.')
//	          ->group(function () {
//
//	          });
//     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.


	     // Students api
	     Route::middleware('students')
	          ->group(function () {

		          Route::prefix('scores')
		               ->group(function () {
						   // Save a score - id of the score must be known
			               Route::apiResource('scores', ScoreApiController::class)
				               ->only(['show', 'update']);
//			               Route::post('/scores/{score}/update', [ScoreApiController::class, 'update'])
//			                    ->name('update');

						   // REFACTOR: These two routes must be removed.
			               Route::post('/post/{post}/update', [ScoreApiController::class, 'updatePostScore'])
			                    ->name('post');
			               Route::post('/challenge/{challenge}/update', [ScoreApiController::class, 'updateChallengeScore'])
			                    ->name('challenge');
		               });

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {

	          });

     });
