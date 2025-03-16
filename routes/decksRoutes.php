<?php

use App\Http\Controllers\DeckController;

// Must be a verified user
Route::get('decks', [DeckController::class, 'index'])
	->name('decks.index');

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
	Route::get('decks/{deck}', [DeckController::class, 'show'])
		->name('decks.show');
});

// TODO: This route is to display a formated deck.
//Route::get('decks/{deck:slug}', [DeckController::class, 'show'])
//	->name('decks.show');


Route::middleware("can:admin")->group(function () {
	Route::get('decks/{deck:slug}/edit', [DeckController::class, "edit"])
		->name('decks.edit');

	Route::get('cards/{card}', [DeckController::class, 'getCards'])
		->name('cards.multiple');

	Route::post('decks/{deck}/addCard', [DeckController::class, "addCard"])
		->name('decks.addCard');

	Route::delete('cards/{card}/destroy', [DeckController::class, 'destroyCard'])
		->name('cards.destroy');



	Route::apiResource('decks', DeckController::class)
		->only('store', 'update', 'destroy');

	Route::post('decks/updateOrder', [DeckController::class, 'updateOrder'])
		->name('decks.updateOrder');

	Route::patch('decks/{deck}/assignChapter', [DeckController::class, 'assignChapter'])
		->name('decks.assignChapter');


});
