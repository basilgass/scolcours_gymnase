<?php

use App\Http\Controllers\api\CardApiController;

Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::apiResource('decks.cards', CardApiController::class)
	          ->shallow()
	          ->only(['index', 'show']);

	     // Students api
	     Route::middleware('students')
		     ->prefix('students')
		     ->as('students.')
	          ->group(function () {

		          Route::get('cards/{card}', [CardApiController::class, 'fetch'])
		               ->name('cards.show');
	          });

	     // Admin api
	     Route::middleware('admin')
		     ->prefix('admin')
		     ->as('admin.')
	          ->group(function () {
		          Route::apiResource('decks.cards', CardApiController::class)
		               ->shallow()
		               ->only(['store', 'update', 'destroy']);


	          });

     });
