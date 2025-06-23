<?php

use App\Http\Controllers\api\QuestionApiController;
use App\Http\Controllers\web\QuestionController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.

	     // Redirection
	     Route::resource('questions', QuestionController::class)
	          ->only(['show']);


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
				 Route::resource('questions', QuestionController::class)
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

		          Route::post('questions/{question}/validate', [QuestionApiController::class, 'storeAnswer'])
		               ->name('questions.validate');

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {
		          Route::apiResource('questions', QuestionApiController::class);

		          Route::prefix('questions')
		               ->as('questions.')
		               ->group(function () {
			               Route::post('{question}/duplicate', [QuestionApiController::class, 'duplicate'])
			                    ->name('duplicate');

			               Route::post('store', [QuestionApiController::class, 'store'])
			                    ->name('store');

			               Route::patch('update/order/for/{type}/{id}', [QuestionApiController::class, 'updateQuestionsOrder'])
			                    ->name('updateOrder');

			               Route::patch('patch/update/displayIf', [QuestionApiController::class, 'updateQuestionsDisplayIf'])
			                    ->name('batch.updateDisplayIf');

			               Route::patch('{question}/update/displayIf', [QuestionApiController::class, 'updateQuestionDisplayIf'])
			                    ->name('updateDisplayIf');

			               Route::patch('{question}/moveTo/{post}', [QuestionApiController::class, 'moveToPost'])
			                    ->name('moveTo.post');
				   });


	          });

     });
