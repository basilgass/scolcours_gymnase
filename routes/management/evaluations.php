<?php

use App\Http\Controllers\api\EvaluationApiController;
use App\Http\Controllers\web\Admin\EvaluationAdminController;
use App\Http\Controllers\web\EvaluationController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.

	     // Students routes
	     Route::middleware('students')
	          ->as('students.')
	          ->group(function () {
		          Route::resource('evaluations', EvaluationController::class)
		               ->only(['index', 'show']);
	          });

	     // Admin routes
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::resource('evaluations', EvaluationAdminController::class)
		               ->only(['index', 'show', 'edit']);
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
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::apiResource('evaluations', EvaluationApiController::class)
		               ->only(['index', 'show', 'store', 'update', 'destroy']);
		          Route::get('evaluations/{evaluation}/team/{team:name}/scores', [EvaluationApiController::class, 'scores'])
		               ->name('evaluations.teams.scores');

		          Route::patch('evaluations/{evaluation}/toggleTeam/{team}', [EvaluationApiController::class, 'toggleTeam'])
		               ->name('evaluations.teams.toggle');
	          });

     });
