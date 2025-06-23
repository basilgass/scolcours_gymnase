<?php

use App\Http\Controllers\api\CardApiController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.


	     // Students routes
	     Route::middleware('students')
		     ->prefix('students')
		     ->as('students.')
	          ->group(function () {

	          });

	     // Admin routes
	     Route::middleware('admin')
		     ->prefix('admin')
		     ->as('admin.')
		     ->group(function () {

	          });
     });


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
	          ->group(function () {

		          Route::get('cards/{card}', [CardApiController::class, 'fetch'])
		               ->name('cards.fetch');
	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {
		          // TODO: Make the cards editable for students ?
		          Route::apiResource('decks.cards', CardApiController::class)
		               ->shallow()
		               ->except(['index', 'show']);


	          });

     });
