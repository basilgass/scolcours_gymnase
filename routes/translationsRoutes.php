<?php

use App\Http\Controllers\TranslationController;

// Langues autorisées
$langues = 'italiano|english|deutsch';

// For each languages, show the different games
Route::get("{language}", [TranslationController::class, "index"])
	->where('language', $langues)
	->name('translations.index');

// Show a game
Route::get("{language}/{game}", [TranslationController::class, "show"])
	->where('language', $langues)
	->where('game', 'memory|guess|list|type')
	->name('translations.show');

// Get the list of words for a game
Route::get('translation/{unit}/words', [TranslationController::class, 'fetchWords'])
	->name('translations.words');


Route::middleware("can:admin")->group(function () {
	// GET
	Route::get('translation', [TranslationController::class, 'import'])
		->name('translations.import');

	// POST
	Route::post('translation/word', [TranslationController::class, 'create'])
		->name('translations.create');

	// PATCH
	Route::patch('translation/words/{translation}/edit', [TranslationController::class, 'updateTranslation'])
		->name('translations.words.update');

	// DELETE

});
