<?php

use App\Http\Controllers\GeneratorController;

Route::get('generators/{generator}', [GeneratorController::class, 'find'])
	->name('generators.find');

Route::middleware("can:admin")->group(function () {
	// GET
	Route::get('generators', [GeneratorController::class, 'index'])
		->name('generators.index');
	Route::get('generators/{generator}/edit', [GeneratorController::class, "edit"])
		->name('generators.edit');

	// POST
	Route::post('generators', [GeneratorController::class, 'store'])
		->name('generators.store');

	// PATCH
	Route::patch('generators/{generator}', [GeneratorController::class, 'update'])
		->name('generators.update');

	// DESTROY
	Route::delete('generators/{generator}', [GeneratorController::class, 'destroy'])
		->name('generators.destroy');
});
