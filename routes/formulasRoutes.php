<?php

// Formulas routes
use App\Http\Controllers\ChapterController;
use App\Http\Controllers\FormulaController;

// Public routes
Route::get("chapters/{chapter:slug}/formulas", [FormulaController::class, 'chapterFormular'])
	->name('chapters.formulas.index');
Route::get("chapters/{chapter:slug}/theorems", [ChapterController::class, 'theorems'])
	->name('chapters.theorems.index');

Route::get("formulas", [FormulaController::class, 'index'])
	->name('formulas.index');

// Admin routes
Route::middleware("can:admin")
	->group(function () {
		// GET

		// POST
		Route::post("chapters/{chapter:slug}/formulas", [FormulaController::class, 'store'])
			->name('formulas.store');
		Route::post('formulas/{formula}/duplicate', [FormulaController::class, 'duplicate'])
			->name('formulas.duplicate');
		Route::post('formulas/updateOrder', [FormulaController::class, 'updateOrder'])
			->name('formulas.updateOrder');

		// PATCH


		// DELETE
		Route::delete('formulas/{formula}', [FormulaController::class, 'destroy'])
			->name('formulas.destroy');


	});
