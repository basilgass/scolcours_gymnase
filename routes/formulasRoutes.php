<?php

// Formulas routes
use App\Http\Controllers\FormulaController;


// chapters.formulas.store, index
// formulas.update
//Route::apiResource('chapters.formulas', FormulaController::class)
//	->parameters([
//		'chapters' => 'chapter:slug'
//	])
//	->shallow();

// Public route
Route::get("chapters/{chapter:slug}/formulas", [FormulaController::class, 'index'])
	->name('chapters.formulas.index');


Route::middleware("can:admin")->group(function () {
	Route::post("chapters/{chapter:slug}/formulas", [FormulaController::class, 'store'])
		->name('chapters.formulas.store');
	Route::patch('formulas/{formula}', [FormulaController::class, 'update'])
		->name('formulas.update');
	Route::delete('formulas/{formula}', [FormulaController::class, 'destroy'])
		->name('formulas.destroy');

	Route::post('formulas/{formula}/duplicate', [FormulaController::class, 'duplicate'])->name('formulas.duplicate');
	Route::post('formulas/updateOrder', [FormulaController::class, 'updateOrder'])->name('formulas.updateOrder');
});
