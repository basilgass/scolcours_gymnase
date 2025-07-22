<?php

use App\Http\Controllers\web\EvaluationController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::get('evaluations/{evaluation}', [EvaluationController::class, 'show'])
	          ->name('evaluations.show');

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

	          });

     });
