<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\api\ToolApiController;
use App\Http\Controllers\web\ToolController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('tools', ToolController::class)
		     ->parameters([
				 "tools"=>"tool:slug",
		     ])
	          ->only(['index', 'show']);

	     // Admin routes
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::get('tools', [AdminController::class, 'tools'])
		               ->name('tools.index');

		          Route::get('tools/{tool}/edit', [ToolController::class, 'edit'])
		               ->name('tools.edit');
	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::get('tools', [ToolApiController::class, 'index'])
	          ->name('tools.index');


	     // Students api
	     Route::middleware('students')
	          ->group(function () {

	          });

	     // Admin api
	     Route::middleware('admin')
		     ->prefix('admin')
		     ->as('admin.')
	          ->group(function () {

		          Route::apiResource('tools', ToolApiController::class);

	          });

     });
