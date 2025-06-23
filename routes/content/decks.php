<?php

use App\Http\Controllers\api\DeckApiController;
use App\Http\Controllers\web\DeckController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('decks', DeckController::class)
	          ->only(['index', 'show']);

	     Route::get('decks/{deck}/portfolio', [DeckController::class, 'portfolio'])
	          ->name('decks.portfolio');


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
	     Route::apiResource('decks', DeckApiController::class)
	          ->only(['index', 'show']);


	     // Students api
	     Route::middleware('students')
	          ->group(function () {

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {

		          Route::apiResource('decks', DeckApiController::class);

		          Route::prefix('decks')
		               ->as('decks.')
		               ->group(function () {
			               Route::post('{deck}/cards/order', [DeckApiController::class, 'reorderCards'])
			                    ->name('cards.order');
			               Route::patch('{deck}/updateChapter', [DeckApiController::class, 'updateChapter'])
			                    ->name('updateChapter');
		               });;
	          });

     });
