<?php

use App\Http\Controllers\api\TeamApiController;
use App\Http\Controllers\web\TeamController;

Route::middleware('web')
     ->group(function () {

	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::prefix('teams')
		               ->as('teams.')
		               ->group(function () {

			               Route::get('/', [TeamController::class, "index"])
			                    ->name('index');
			               Route::get('{team:name}', [TeamController::class, 'show'])
			                    ->name('show');
			               Route::get('{team:name}/challenge/{challenge:slug}', [TeamController::class, 'challenge'])
			                    ->withoutScopedBindings()
			                    ->name('challenges.show');

			               Route::get('{team:name}/stats/{chapter:slug}', [TeamController::class, "stats"])
			                    ->withoutScopedBindings()
			                    ->name('chapters.stats');
		               });
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

		          Route::apiResource('teams', TeamApiController::class);

		          Route::prefix('teams')
		               ->as('teams.')
		               ->group(function () {

			               Route::patch('/{team}/toggle/{user}', [TeamApiController::class, "toggle"])
			                    ->name('toggleUser');

			               Route::get('/{team}/users', [TeamApiController::class, 'users'])
			                    ->name('users');
		               });
	          });

     });
