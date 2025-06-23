<?php

use App\Http\Controllers\api\PostApiController;
use App\Http\Controllers\web\PostController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('posts', PostController::class)
	          ->only(['index', 'show']);

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
		          Route::resource('posts', PostController::class)
		               ->only(['edit']);

	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.

	     //REFACTOR Récupère juste le titre du modèle - à généraliser ?
	     Route::get('posts/{post}/info', [PostApiController::class, 'info'])
	          ->name('posts.info');


	     // Students api
	     Route::middleware('students')
	          ->group(function () {

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {
		          Route::apiResource('posts', PostApiController::class);

		          Route::prefix('posts')
		               ->as('posts.')
		               ->group(function () {
			               Route::patch('{post}/move', [PostApiController::class, 'move'])
			                    ->name('move');

			               Route::patch('{post}/blocks/order', [PostApiController::class, 'reorderBlocks'])
			                    ->name('blocks.order');

			               Route::patch('{post}/questionsGrid/update', [PostApiController::class, 'updateQuestionsGrid'])
			                    ->name('updateQuestionsGrid');

			               Route::patch('{post}/questions/answers/reset', [PostApiController::class, 'resetAnswers'])
			                    ->name('answers.reset');
		               });
	          });

     });
