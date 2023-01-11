<?php

// Formulas routes
use App\Http\Controllers\FormulaController;

Route::apiResource('chapters.formulas', FormulaController::class)
	->parameters([
		'chapters' => 'chapter:slug'
	])
	->shallow();
Route::post('formulas/{formula}/duplicate', [FormulaController::class, 'duplicate'])->name('formulas.duplicate');
Route::post('formulas/updateOrder', [FormulaController::class, 'updateOrder'])->name('formulas.updateOrder');


