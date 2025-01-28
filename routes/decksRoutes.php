<?php

use App\Http\Controllers\DeckController;

// Must be a verified user
Route::get('decks', [DeckController::class, 'index'])
	->name('decks.index');
Route::get('decks/{deck:slug}', [DeckController::class, 'show'])
	->name('decks.show');

Route::middleware("can:admin")->group(function () {
	Route::get('decks/{deck:slug}/edit', [DeckController::class, "edit"])
		->name('decks.edit');

	Route::get('flipcards/{flipcard}', [DeckController::class, 'getFlipcards'])
		->name('flipcards.multiple');

	Route::post('decks/{deck}/addFlipcard', [DeckController::class, "addFlipcard"])
		->name('decks.addFlipcard');

	Route::delete('flipcards/{flipcard}/destroy', [DeckController::class, 'destroyFlipcard'])
		->name('flipcards.destroy');



	Route::apiResource('decks', DeckController::class)
		->only('store', 'update', 'destroy');

	Route::post('decks/updateOrder', [DeckController::class, 'updateOrder'])
		->name('decks.updateOrder');

	Route::patch('decks/{deck}/assignChapter', [DeckController::class, 'assignChapter'])
		->name('decks.assignChapter');


});
