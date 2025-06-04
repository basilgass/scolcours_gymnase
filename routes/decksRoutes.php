<?php

use App\Http\Controllers\DeckController;

//TODO: Reformat routes to clearly differentiate Deck, Card, UserDeck and UserCard routes.
Route::get('decks', [DeckController::class, 'index'])
	->name('decks.index');

Route::get('decks/fetch', [DeckController::class, 'fetchAvailableDecks'])
	->name('decks.fetch');

// Must be a verified user
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
	Route::get('decks/{deck}', [DeckController::class, 'show'])
		->name('decks.show');



	Route::get('decks/{deck}/portfolio', [DeckController::class, 'portfolio'])
		->name('decks.userdecks.portfolio');

	Route::get('decks/{deck}/cards/fetch', [DeckController::class, 'fetchCards'])
		->name('decks.cards.fetch');

	Route::post('decks/cards/{card}/update', [DeckController::class, 'updateCard'])
		->name('decks.updateCard');

	Route::post('userdecks/create', [DeckController::class, 'createUserDeck'])
		->name('decks.userdecks.create');

	Route::delete('userdecks/{deck}', [DeckController::class, 'destroyUserDeck'])
		->name('decks.userdecks.destroy');
});


// TODO: This route is to display a formated deck.
//Route::get('decks/{deck:slug}', [DeckController::class, 'show'])
//	->name('decks.show');
Route::middleware("can:admin")->group(function () {
	Route::get('decks/{deck}/edit', [DeckController::class, "edit"])
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
