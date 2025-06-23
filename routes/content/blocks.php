<?php

use App\Http\Controllers\api\BlockApiController;
use App\Http\Controllers\web\BlockController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('blocks', BlockController::class)
	          ->only(['show']);

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
		          Route::resource('blocks', BlockController::class)
		               ->only('edit');
	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.


	     // Students api
	     Route::middleware('students')
	          ->group(function () {

	          });

	     // Admin api
	     Route::middleware('admin')
//		     ->as('api.')
              ->group(function () {
			     Route::apiResource('blocks', BlockApiController::class);

			     Route::prefix('blocks')
			          ->as('blocks.')
			          ->group(function () {
				          Route::patch('{block}/move',
					          [BlockApiController::class, 'move'])
				               ->name('move');

				          Route::patch('{block}/illustrationsGrid/update',
					          [BlockApiController::class, 'updatePartial'])
				               ->name('updateIllustrationsGrid');

				          Route::patch('{block}/illustrations/order',
					          [BlockApiController::class, 'reorderIllustrations'])
				               ->name('illustrations.order');

			          });

		     });

     });
