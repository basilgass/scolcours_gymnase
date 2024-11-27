<?php

// Formulas routes
use App\Http\Controllers\FormulaController;

// Public routes
Route::get("chapters/{chapter:slug}/formulas", [FormulaController::class, 'getFormulasFromChapter'])
	->name('chapters.formulas.index');

Route::get("formulaire", [FormulaController::class, 'index'])
	->name('formulas.index');

Route::get('formulas/{formula}', [FormulaController::class, 'getOne'])
    ->name('formulas.one');
Route::get('formulas/{formula}', [FormulaController::class, 'getFormulas'])
    ->name('formulas.multiple');

// Admin routes
Route::middleware("can:admin")
	->group(function () {
		// GET
//		Route::get("formulas/chapter/{chapter}", function (Chapter $chapter) {
//			return FormulaResource::collection($chapter->formulas)
//				->sortBy(function ($formula) {
//					return $formula->blocks[ 0 ]->order;
//				})->values()->all();
//		});

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
