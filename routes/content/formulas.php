<?php

use App\Http\Controllers\api\FormulaApiController;
use App\Http\Controllers\web\FormulaController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('formulaire', FormulaController::class)
	          ->names('formulas')
	          ->only(['index']);

	     // Students routes
	     Route::middleware('students')
		     ->prefix('students')
		     ->as('students.')
	          ->group(function () {

	          });

	     // Admin routes
	     Route::middleware('admin')
		     ->prefix('admin')
		     ->as('admin.')
		     ->group(function () {

	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::get("chapters/{chapter:slug}/formulas", [FormulaApiController::class, 'getFormulasFromChapter'])
	          ->name('chapters.formulas.index');
	     Route::get('formulas/{formula}', [FormulaApiController::class, 'fetch'])
	          ->name('formulas.fetch');


	     // Students api
	     Route::middleware('students')
	          ->group(function () {

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {
		          Route::apiResource('formulas', FormulaApiController::class);

		          Route::prefix('formulas')
		               ->as('formulas.')
		               ->group(function () {
			               Route::post('updateOrder', [FormulaApiController::class, 'updateOrder'])
			                    ->name('updateOrder');

			               Route::post('{formula}/duplicate', [FormulaApiController::class, 'duplicate'])
			                    ->name('duplicate');
		               });
	          });

     });
