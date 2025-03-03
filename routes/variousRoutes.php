<?php

use App\Http\Controllers\ScolcoursController;

Route::get("/b", function () {return redirect()->to('/bareme');});
Route::get("/bareme", function () {return \Inertia\Inertia::render("Singles/GraduatePage");})
	->name('bareme.show');

Route::get("/g", function () {return redirect()->to('/grapheur');});
Route::get("/grapheur", function () {return \Inertia\Inertia::render("Singles/GraphPage");})->name('grapheur.show');
Route::post('/grapheur/svg/download', [ScolcoursController::class, "download"])
	->name('grapheur.download');



// Check if a word is in the dictionary
Route::get('/dico/check/{language}/{word}', [ScolcoursController::class, 'wordExistsInDictionary'])
	->name('dico.exists');

// Get a word from the dictionary
Route::get('/dico/{language}/{number}/{size}/{common?}', [ScolcoursController::class, 'dico'])
	->name('dico.fetch');

