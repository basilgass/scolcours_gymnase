<?php

use App\Http\Controllers\api\ScoreApiController;


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.


	     // Students api
	     Route::middleware('students')
	          ->prefix('students')
	          ->as('students.')
	          ->group(function () {

		          // Save a score - id of the score must be known
		          Route::apiResource('scores', ScoreApiController::class)
		               ->only(['index', 'show', 'update']);

		          Route::prefix('scores')
		               ->group(function () {
			               Route::patch('reset', [ScoreApiController::class, "reset"])
			                    ->name('scores.reset');
		               });
	          });

	     // Admin api
	     Route::middleware('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::delete('/scores', [ScoreApiController::class, 'destroyMultiple'])
		               ->name('scores.bulk');
	          });

     });
