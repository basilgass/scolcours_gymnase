<?php

use App\Http\Controllers\api\BlockApiController;
use App\Http\Controllers\api\IllustrationApiController;
use App\Http\Controllers\web\BlockController;
use App\Http\Controllers\web\IllustrationController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('blocks', BlockController::class)
	          ->only(['show']);

	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::resource('blocks', BlockController::class)
		               ->only(['edit']);

		          Route::resource('illustrations', IllustrationController::class)
		               ->only(['edit']);
	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.

	     // Admin api
	     Route::middleware('admin')
		     ->prefix('admin')
		     ->as('admin.')
	          ->group(function () {
		          Route::apiResource('blocks', BlockApiController::class);

		          Route::apiResource('blocks.illustrations', IllustrationApiController::class)
		               ->shallow()
		               ->only(['show', 'store', 'update', 'destroy']);


		          Route::prefix('blocks')
		               ->as('blocks.')
		               ->group(function () {
			               Route::get('{block}/blockable/url', [BlockApiController::class, 'fetchBlockableUrl'])
			                    ->name('blockable.url');

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
