<?php

use App\Http\Controllers\api\QuizzApiController;
use App\Http\Controllers\web\QuizzController;

Route::middleware('web')
     ->group(function () {

	     // Admin routes
	     Route::middleware('admin')
		     ->as('admin.')
		     ->prefix('admin')
		     ->group(function () {

			     Route::resource('quizzes', QuizzController::class)
				     ->only('index', 'edit')
				     ->parameters(['quizzes' => 'quizz']);

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

		          Route::apiResource('quizzes', QuizzApiController::class)
		               ->only(['store', 'update', 'destroy'])
		               ->parameters(['quizzes' => 'quizz']);

	          });
     });
