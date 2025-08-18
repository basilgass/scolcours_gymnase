<?php

use App\Http\Controllers\UserApiController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.


	     // Students routes
	     Route::middleware('students')
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


	     // Students api
	     Route::middleware('students')
		     ->prefix('students')
		     ->as('students.')
	          ->group(function () {
		          Route::apiResource('users', UserApiController::class)
			          ->only(['show']);
	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {

	          });

     });
