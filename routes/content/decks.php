<?php

use App\Http\Controllers\api\DeckApiController;
use App\Http\Controllers\web\DeckController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('decks', DeckController::class)
	          ->only(['index', 'show'])
	          ->scoped(['deck' => 'slug']);

	     Route::get('decks/{deck:slug}/portfolio', [DeckController::class, 'portfolio'])
	          ->name('decks.portfolio');


	     // Admin routes
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::resource('decks', DeckController::class)
		               ->only(['edit']);

		          Route::get('decks', [DeckController::class, 'dashboard'])
		               ->name('decks.index');
	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::apiResource('decks', DeckApiController::class)
	          ->only(['index', 'show']);


	     // Admin api
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {

		          Route::apiResource('decks', DeckApiController::class);

		          Route::prefix('decks')
		               ->as('decks.')
		               ->group(function () {
			               Route::patch('{deck}/cards/order', [DeckApiController::class, 'reorderCards'])
			                    ->name('cards.order');
			               Route::patch('{deck}/updateChapter', [DeckApiController::class, 'updateChapter'])
			                    ->name('updateChapter');
			               Route::patch('{deck}/toggleActive', [DeckApiController::class, 'toggleActive'])
			                    ->name('toggleActive');
		               });;
	          });

     });
