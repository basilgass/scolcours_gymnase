<?php

use App\Http\Controllers\TranslationController;

Route::get("{language}", [TranslationController::class, "index"])
	->where('language', 'italiano|english')
	->name('translation.index');
Route::get("{language}/{game}", [TranslationController::class, "show"])
	->where('language', 'italiano|english')
	->where('game', 'memory|guess|list|type')
	->name('translation.show');
Route::get('translation/{unit}/words', [TranslationController::class, 'fetchWords'])
	->name('translation.words');


Route::middleware("can:admin")->group(function () {
	Route::get('translation', [TranslationController::class, 'import'])
		->name('translation.import');
	Route::post('translation/word', [TranslationController::class, 'create'])
		->name('translation.create');
	// TODO: donner la possibilité d'éditer / modifier des translations fausses.
	Route::patch('translation/words/{translation}/edit', [TranslationController::class, 'updateTranslation'])
		->name('translation.words.update');

});
