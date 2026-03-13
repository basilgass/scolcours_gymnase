<?php

use App\Http\Controllers\api\FormulaApiController;
use App\Http\Controllers\web\FormulaController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('formulaire', FormulaController::class)
	          ->names('formulas')
		     ->parameters(['formulaire' => 'formula'])
	          ->only(['index', 'show']);

     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::apiResource('formulas', FormulaApiController::class)
	          ->only(['index', 'show']);

	     Route::get("formulas/chapters/{chapter}", [FormulaApiController::class, 'getFormulasFromChapter'])
	          ->name('chapters.formulas.index');


	     // Admin api
	     Route::middleware('admin')
		     ->prefix('admin')
		     ->as('admin.')
	          ->group(function () {
		          Route::apiResource('chapters.formulas', FormulaApiController::class)
		               ->shallow()
		               ->only(['store', 'update', 'destroy']);

		          Route::prefix('formulas')
		               ->as('formulas.')
		               ->group(function () {
			               Route::post('updateOrder', [FormulaApiController::class, 'updateOrder'])
			                    ->name('order');

			               Route::post('{formula}/duplicate', [FormulaApiController::class, 'duplicate'])
			                    ->name('duplicate');

			               Route::patch('{formula}/move',
				               [FormulaApiController::class, 'move'])
			                    ->name('move');
		               });
	          });

     });
