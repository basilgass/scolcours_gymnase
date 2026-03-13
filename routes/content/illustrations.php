<?php

use App\Http\Controllers\api\IllustrationApiController;
use App\Http\Controllers\web\IllustrationController;

Route::middleware('web')
     ->group(function () {

	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->prefix('admin')
	          ->group(function () {
		          Route::resource('illustrations', IllustrationController::class)
		               ->only(['edit']);
	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {

	     // Admin api
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {

		          Route::prefix('illustrations')
		               ->as('illustrations.')
		               ->group(function () {
			               Route::post('store/to/blocks/{block}', [IllustrationApiController::class, 'store'])
			                    ->name('store');
			               Route::post('image/upload', [IllustrationApiController::class, "upload"])
			                    ->name('upload');
		               });

	          });
     });
