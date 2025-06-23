<?php

use App\Http\Controllers\api\IllustrationApiController;
use App\Http\Controllers\web\IllustrationController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('illustrations', IllustrationController::class)
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

				  Route::resource('illustrations', IllustrationController::class)
					  ->only(['show', 'index', 'edit']);
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
	          ->group(function () {

		          Route::apiResource('illustrations', IllustrationApiController::class);

		          Route::prefix('illustrations')
		               ->as('illustrations.')
		               ->group(function () {
			               Route::post('store/to/blocks/{block}', [IllustrationApiController::class, 'store'])
			                    ->name('store');
			               Route::post('image/upload', [IllustrationApiController::class, "upload"])
			                    ->name('images.upload');

		               });
	          });

     });
