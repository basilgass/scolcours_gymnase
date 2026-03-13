<?php

use App\Http\Controllers\api\PostApiController;
use App\Http\Controllers\web\PostController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::resource('posts', PostController::class)
	          ->only(['index', 'show']);

	     Route::get('posts/{post}/blocks/{block}', [PostController::class, 'anchor'])
	          ->name('posts.blocks.anchor');


	     // Admin routes
	     Route::middleware('admin')
	          ->as('admin.')
	          ->prefix('admin')
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
	     Route::apiResource('posts', PostApiController::class)
	          ->only(['index', 'show']);


	     //REFACTOR Récupère juste le titre du modèle - à généraliser ?
	     Route::get('posts/{post}/info', [PostApiController::class, 'info'])
	          ->name('posts.info');


	     // Admin api
	     Route::middleware('admin')
	          ->prefix('admin')
	          ->as('admin.')
	          ->group(function () {
		          Route::apiResource('posts', PostApiController::class)
		               ->only(['store', 'update', 'destroy']);

		          Route::prefix('posts')
		               ->as('posts.')
		               ->group(function () {
			               Route::patch('{post}/move', [PostApiController::class, 'move'])
			                    ->name('move');

			               Route::patch('{post}/revised', [PostApiController::class, 'revised'])
			                    ->name('revised');

			               Route::patch('{post}/blocks/order', [PostApiController::class, 'reorderBlocks'])
			                    ->name('blocks.order');

			               Route::patch('{post}/questionsGrid/update', [PostApiController::class, 'updateQuestionsGrid'])
			                    ->name('questions.grid');

			               Route::patch('{post}/questions/answers/reset', [PostApiController::class, 'resetAnswers'])
			                    ->name('answers.reset');
		               });
	          });

     });
