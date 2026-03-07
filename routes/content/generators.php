<?php

use App\Http\Controllers\web\GeneratorApiController;
use App\Http\Controllers\web\GeneratorController;

Route::middleware('web')
     ->group(function () {

	     Route::resource('generators', GeneratorController::class)
	          ->only(['show']);

	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
		     ->prefix('admin')
	          ->group(function () {
		          Route::resource('generators', GeneratorController::class)
		               ->only(['index', 'show', 'edit']);

	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
		 // Public api.
	     Route::apiResource('generators', GeneratorApiController::class)
		     ->only(['index', 'show']);

	     // Admin api
	     Route::middleware('admin')
		     ->prefix('admin')
		     ->as('admin.')
	          ->group(function () {
		          Route::apiResource('generators', GeneratorApiController::class);
	          });

     });
