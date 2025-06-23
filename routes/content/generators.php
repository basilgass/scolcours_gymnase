<?php

use App\Http\Controllers\web\GeneratorApiController;
use App\Http\Controllers\web\GeneratorController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.


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
		          Route::resource('generators', GeneratorController::class)
		               ->only(['index', 'show', 'edit']);

	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::get('generators/{generator}', [GeneratorApiController::class, 'fetch'])
	          ->name('generators.fetch');


	     // Students api
	     Route::middleware('students')
	          ->group(function () {

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {
		          Route::apiResource('generators', GeneratorApiController::class);
	          });

     });
