<?php

use App\Http\Controllers\api\Translations\TranslationBookController;
use App\Http\Controllers\api\Translations\TranslationUnitController;
use App\Http\Controllers\api\Translations\TranslationWordController;
use App\Http\Controllers\web\TranslationController;

Route::middleware('web')
     ->group(function () {
	     // Public routes.
	     Route::prefix('voc')
	          ->as('voc.')
	          ->group(function () {
		          Route::get("{language:slug}", [TranslationController::class, "index"])
		               ->name('index');

		          Route::get("{language:slug}/{game}", [TranslationController::class, "show"])
		               ->where('game', 'memory|guess|list|type|deck|match')
		               ->name('show');
	          });


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

		          Route::prefix('voc')
		               ->as('voc.')
		               ->group(function () {
			               Route::get('/import', [TranslationController::class, "import"])
			                    ->name('import');
		               });

	          });
     });


Route::middleware('api')
     ->prefix('api')
     ->as('api.')
     ->group(function () {
	     // Public api.
	     Route::prefix('voc')
	          ->as('voc.')
	          ->group(function () {
		          Route::apiResource('languages.books', TranslationBookController::class)
		               ->parameters([
			               'languages' => 'language:slug'
		               ])
		               ->shallow()
		               ->only(['index', 'show']);
		          Route::apiResource('books.units', TranslationUnitController::class)
		               ->shallow()
		               ->only(['index', 'show']);
		          Route::apiResource('units.words', TranslationWordController::class)
		               ->shallow()
		               ->only(['index', 'show']);
	          });


	     // Students api
	     Route::middleware('students')
	          ->group(function () {

	          });

	     // Admin api
	     Route::middleware('admin')
	          ->group(function () {

		          Route::prefix('admin/voc')
		               ->as('voc.')
		               ->group(function () {
			               Route::apiResource('languages.books', TranslationBookController::class)
			                    ->parameters([
				                    'languages' => "language:slug"
			                    ])
			                    ->except(['index', 'show']);
			               Route::apiResource('books.units', TranslationUnitController::class)
			                    ->shallow()
			                    ->except(['index', 'show']);
			               Route::apiResource('units.words', TranslationWordController::class)
			                    ->shallow()
			                    ->except(['index', 'show']);

		               });

	          });

     });
