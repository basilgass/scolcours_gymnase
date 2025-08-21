<?php

use App\Http\Controllers\api\WidgetApiController;

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
		     ->prefix('admin')
		     ->as('admin.')
	          ->group(function () {
		          Route::get('widgets/refresh', [WidgetApiController::class, 'refresh'])
		               ->name('widgets.refresh');

		          Route::apiResource('widgets', WidgetApiController::class);
	          });

     });
