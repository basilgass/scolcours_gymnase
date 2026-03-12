<?php

use App\Http\Controllers\ScolcoursController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::get('/dico/check/{language}/{word}', [ScolcoursController::class, 'wordExistsInDictionary'])
	          ->name('dico.exists');

	     Route::get('/dico/{language}/{number?}/{size?}/{common?}/{withoutDuplicateLetters?}', [ScolcoursController::class, 'dico'])
	          ->name('dico.index');
     });
