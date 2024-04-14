<?php

use App\Http\Controllers\GeneratorController;

Route::middleware("can:admin")->group(function () {
	// GET
	Route::get('generators', [GeneratorController::class, 'index'])
		->name('generators.index');
	Route::get('generators/{generator}/edit', [GeneratorController::class, "edit"])
		->name('generators.edit');

	// PATCH
	Route::patch('generators/{generator}', [GeneratorController::class, 'update'])
		->name('generators.update');

	// DESTROY
	Route::delete('generators/{generator}', [GeneratorController::class, 'destroy'])
		->name('generators.destroy');
});
