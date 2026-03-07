<?php

use App\Http\Controllers\api\QuestionApiController;
use App\Http\Controllers\web\QuestionController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.

	     // Redirection
	     Route::resource('questions', QuestionController::class)
	          ->only(['show']);

	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::resource('questions', QuestionController::class)
		               ->only(['index', 'edit']);

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

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::apiResource('questions', QuestionApiController::class);

		          Route::prefix('questions')
		               ->as('questions.')
		               ->group(function () {
			               Route::post('{question}/duplicate', [QuestionApiController::class, 'duplicate'])
			                    ->name('duplicate');

			               Route::patch('update/order/for/{type}/{id}', [QuestionApiController::class, 'updateQuestionsOrder'])
			                    ->name('updateOrder');

			               Route::patch('batch/displayIf', [QuestionApiController::class, 'updateBatchDisplayIf'])
			                    ->name('batch.updateDisplayIf');

			               Route::patch('{question}/update/displayIf', [QuestionApiController::class, 'updateQuestionDisplayIf'])
			                    ->name('updateDisplayIf');

			               Route::patch('{question}/move', [QuestionApiController::class, 'move'])
			                    ->name('move');
		               });


	          });

     });
